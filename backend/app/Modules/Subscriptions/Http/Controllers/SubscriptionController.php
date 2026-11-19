<?php

namespace App\Modules\Subscriptions\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Subscriptions\Gateways\PaymentGateway;
use App\Modules\Subscriptions\Gateways\PaymentGatewayException;
use App\Modules\Subscriptions\Models\Payment;
use App\Modules\Subscriptions\Models\Plan;
use App\Modules\Subscriptions\Support\Entitlements;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    public function plans(): JsonResponse
    {
        return response()->json(['data' => Plan::where('status', 'active')->orderBy('sort_order')->get()->map->toApi()]);
    }

    public function current(Request $request, Entitlements $entitlements): JsonResponse
    {
        $user = $request->user();
        $sub = $user->activeSubscription?->load('plan');
        $e = $entitlements->for($user);

        return response()->json([
            'subscription' => $sub ? [
                'id' => (string) $sub->id,
                'plan' => $sub->plan->toApi(),
                'status' => $sub->status,
                'billingPeriod' => $sub->billing_period,
                'startsAt' => $sub->starts_at?->toIso8601String(),
                'expiresAt' => $sub->expires_at?->toIso8601String(),
            ] : null,
            'entitlements' => ['maxChildren' => $e->maxChildren(), 'premiumContent' => $e->canAccessPremium()],
        ]);
    }

    public function checkout(Request $request, PaymentGateway $gateway): JsonResponse
    {
        $data = $request->validate([
            'planId' => ['required', 'integer', 'exists:plans,id'],
            'billingPeriod' => ['required', 'in:monthly,yearly'],
        ]);
        $plan = Plan::where('status', 'active')->findOrFail($data['planId']);
        abort_if($plan->priceFor($data['billingPeriod']) === 0, 422, 'این پلن رایگان است.');

        $payment = DB::transaction(function () use ($request, $plan, $data, $gateway) {
            $sub = $request->user()->subscriptions()->create([
                'plan_id' => $plan->id, 'status' => 'pending', 'billing_period' => $data['billingPeriod'],
            ]);

            return Payment::create([
                'user_id' => $request->user()->id,
                'subscription_id' => $sub->id,
                'amount' => $plan->priceFor($data['billingPeriod']),
                'currency' => $plan->currency,
                'gateway' => $gateway->name(),
            ]);
        });

        try {
            $redirect = $gateway->request($payment->load('user'), url('/api/v1/payments/callback'));
        } catch (PaymentGatewayException $e) {
            $payment->update(['status' => 'failed']);
            $payment->subscription?->update(['status' => 'cancelled']);

            return response()->json(['message' => $e->getMessage()], 502);
        }

        return response()->json(['paymentId' => (string) $payment->id, 'redirectUrl' => $redirect], 201);
    }

    /**
     * بازگشت کاربر از درگاه (GET با Authority و Status).
     * تأیید همیشه سمت سرور و با مبلغ ذخیره‌شده انجام می‌شود؛ قفل ردیف از تأیید هم‌زمان جلوگیری می‌کند.
     * مرورگر به پنل والدین هدایت می‌شود؛ درخواست JSON (تست/اپ) پاسخ JSON می‌گیرد.
     */
    public function callback(Request $request, PaymentGateway $gateway): JsonResponse|RedirectResponse
    {
        $authority = (string) ($request->input('Authority') ?? $request->input('authority'));
        abort_if($authority === '', 404);

        [$status, $ref] = DB::transaction(function () use ($authority, $request, $gateway) {
            $payment = Payment::where('authority', $authority)->lockForUpdate()->firstOrFail();
            if ($payment->status === 'paid') {
                return ['paid', $payment->transaction_id]; // بازگشت تکراری
            }
            if ($payment->status !== 'pending') {
                return ['failed', null];
            }

            try {
                $verified = $gateway->verify($payment, $request->query() + $request->post());
            } catch (PaymentGatewayException) {
                return ['error', null]; // وضعیت pending می‌ماند تا بعداً دوباره بررسی شود
            }

            if (! $verified) {
                $payment->update(['status' => 'failed']);
                $payment->subscription?->update(['status' => 'cancelled']);

                return ['failed', null];
            }

            $payment->update([
                'status' => 'paid', 'transaction_id' => $verified['ref_id'], 'paid_at' => now(),
                'meta' => [...($payment->meta ?? []), 'card_pan' => $verified['card_pan'] ?? null],
            ]);
            $sub = $payment->subscription;
            // اشتراک‌های فعال قبلی بسته می‌شوند
            $sub->user->subscriptions()->where('status', 'active')->whereKeyNot($sub->id)->update(['status' => 'cancelled', 'cancelled_at' => now()]);
            $sub->update([
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => $sub->billing_period === 'yearly' ? now()->addYear() : now()->addMonth(),
            ]);

            return ['paid', $verified['ref_id']];
        });

        $redirect = config('kidsworld.frontend_url').'/parent/billing?'.http_build_query(array_filter(['payment' => $status, 'ref' => $ref]));

        if ($request->expectsJson()) {
            return response()->json(['status' => $status, 'transactionId' => $ref, 'redirectUrl' => $redirect], $status === 'paid' ? 200 : 402);
        }

        return redirect()->away($redirect);
    }

    /** تاریخچه‌ی پرداخت‌های والد */
    public function payments(Request $request): JsonResponse
    {
        return response()->json(['data' => Payment::where('user_id', $request->user()->id)->with('subscription.plan')->latest()->limit(50)->get()->map(fn ($p) => [
            'id' => (string) $p->id,
            'amount' => $p->amount,
            'currency' => $p->currency,
            'status' => $p->status,
            'gateway' => $p->gateway,
            'refId' => $p->transaction_id,
            'plan' => $p->subscription?->plan?->name,
            'billingPeriod' => $p->subscription?->billing_period,
            'paidAt' => $p->paid_at?->toIso8601String(),
            'createdAt' => $p->created_at->toIso8601String(),
        ])]);
    }
}
