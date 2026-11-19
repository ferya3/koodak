<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class ProductionSetupTest extends TestCase
{
    public function test_admin_command_creates_panel_admin(): void
    {
        $this->artisan('kidsworld:admin', ['email' => 'Boss@Example.com', '--password' => 'secret12345'])->assertSuccessful();
        $user = User::where('email', 'boss@example.com')->sole();
        $this->assertTrue($user->hasRole('admin'));
        $this->postJson('/api/v1/auth/login', ['email' => 'boss@example.com', 'password' => 'secret12345'])->assertOk();
    }

    public function test_forwarded_client_ip_is_trusted_only_from_internal_networks(): void
    {
        // از شبکه‌ی داخلی (BFF): IP واقعی کاربر استفاده می‌شود → هر کاربر سقف جداگانه دارد
        for ($i = 0; $i < 10; $i++) {
            $this->withServerVariables(['REMOTE_ADDR' => '172.18.0.5'])->withHeader('X-Forwarded-For', '203.0.113.7')
                ->postJson('/api/v1/auth/login', ['email' => 'x@example.com', 'password' => 'x']);
        }
        $this->withServerVariables(['REMOTE_ADDR' => '172.18.0.5'])->withHeader('X-Forwarded-For', '203.0.113.7')
            ->postJson('/api/v1/auth/login', ['email' => 'x@example.com', 'password' => 'x'])->assertStatus(429);
        $this->withServerVariables(['REMOTE_ADDR' => '172.18.0.5'])->withHeader('X-Forwarded-For', '198.51.100.9')
            ->postJson('/api/v1/auth/login', ['email' => 'x@example.com', 'password' => 'x'])->assertUnprocessable();

        // از اینترنت: X-Forwarded-For جعلی نادیده گرفته می‌شود
        RateLimiter::clear('auth');
        for ($i = 0; $i < 10; $i++) {
            $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.50'])->withHeader('X-Forwarded-For', "10.0.0.$i")
                ->postJson('/api/v1/auth/login', ['email' => 'x@example.com', 'password' => 'x']);
        }
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.50'])->withHeader('X-Forwarded-For', '10.0.0.99')
            ->postJson('/api/v1/auth/login', ['email' => 'x@example.com', 'password' => 'x'])->assertStatus(429);
    }
}
