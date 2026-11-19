<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class AuthTest extends TestCase
{
    public function test_parent_can_register_and_receives_parent_token(): void
    {
        $res = $this->postJson('/api/v1/auth/register', [
            'name' => 'مریم', 'email' => 'Maryam@Example.com', 'password' => 'secret123', 'password_confirmation' => 'secret123', 'accept_terms' => true,
        ])->assertCreated()->assertJsonPath('user.roles', ['parent']);

        $this->assertDatabaseHas('users', ['email' => 'maryam@example.com']);
        $this->getJson('/api/v1/auth/me', $this->bearer($res->json('token')))->assertOk()->assertJsonPath('data.email', 'maryam@example.com');
    }

    public function test_registration_requires_terms_and_strong_password(): void
    {
        $this->postJson('/api/v1/auth/register', ['name' => 'x', 'email' => 'a@b.co', 'password' => '123', 'password_confirmation' => '123'])
            ->assertUnprocessable()->assertJsonValidationErrors(['password', 'accept_terms']);
    }

    public function test_login_rejects_wrong_password_and_suspended_accounts(): void
    {
        $user = User::factory()->create(['password' => 'secret123']);
        $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'nope'])->assertUnprocessable();

        $user->update(['status' => 'suspended']);
        $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'secret123'])->assertUnprocessable();
    }

    public function test_logout_revokes_the_token(): void
    {
        $user = $this->parent();
        $token = $this->parentToken($user);
        $this->postJson('/api/v1/auth/logout', [], $this->bearer($token))->assertOk();
        $this->getJson('/api/v1/auth/me', $this->bearer($token))->assertUnauthorized();
    }
}
