<?php

namespace App\Modules\Subscriptions;

use App\Modules\Shared\ModuleServiceProvider;
use App\Modules\Subscriptions\Gateways\FakeGateway;
use App\Modules\Subscriptions\Gateways\PaymentGateway;
use App\Modules\Subscriptions\Support\Entitlements;
use RuntimeException;

class SubscriptionsServiceProvider extends ModuleServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Entitlements::class);

        $this->app->bind(PaymentGateway::class, function ($app) {
            $driver = config('services.payment.driver', 'fake');
            if ($driver === 'fake' && $app->isProduction()) {
                throw new RuntimeException('Fake payment gateway cannot be used in production.');
            }

            return match ($driver) {
                'fake' => new FakeGateway,
                default => throw new RuntimeException("Unknown payment driver [$driver]."),
            };
        });
    }
}
