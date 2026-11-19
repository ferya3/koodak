<?php

namespace App\Modules\Subscriptions\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Subscriptions\Gateways\PaymentGateway;
use App\Modules\Subscriptions\Models\Payment;
use App\Modules\Subscriptions\Models\Plan;
use App\Modules\Subscriptions\Support\Entitlements;
use Illuminate\Http\JsonResponse;
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

        $redirect = $gateway->request($payment, url('/api/v1/payments/callback'));

        return response()->json(['paymentId' => (string) $payment->id, 'redirectUrl' => $redirect], 201);
    }

    /** بازگشت از درگاه: تأیید در سرور، فعال‌سازی اشتراک، هدایت به پنل والدین */
    public function callback(Request $request, PaymentGateway $gateway): JsonResponse
    {
        $payment = Payment::where('authority', (string) $request->input('authority'))->where('status', 'pending')->firstOrFail();
        $trx = $gateway->verify($payment, $request->all());

        DB::transaction(function () use ($payment, $trx) {
            if (! $trx) {
                $payment->update(['status' => 'failed']);

                return;
            }
            $payment->update(['status' => 'paid', 'transaction_id' => $trx, 'paid_at' => now()]);
            $sub = $payment->subscription;
            // اشتراک‌های فعال قبلی بسته می‌شوند
            $sub->user->subscriptions()->where('status', 'active')->whereKeyNot($sub->id)->update(['status' => 'cancelled', 'cancelled_at' => now()]);
            $sub->update([
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => $sub->billing_period === 'yearly' ? now()->addYear() : now()->addMonth(),
            ]);
        });

        return response()->json([
            'status' => $trx ? 'paid' : 'failed',
            'transactionId' => $trx,
            'redirectUrl' => config('kidsworld.frontend_url').'/parent?payment='.($trx ? 'success' : 'failed'),
        ], $trx ? 200 : 402);
    }
}
