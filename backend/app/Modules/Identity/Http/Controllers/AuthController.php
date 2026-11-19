<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Identity\Http\Requests\LoginRequest;
use App\Modules\Identity\Http\Requests\RegisterRequest;
use App\Modules\Identity\Http\Resources\UserResource;
use App\Modules\Identity\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * احراز هویت والدین با توکن Sanctum.
 * توکن والد ability «parent» دارد؛ توکن جلسه‌ی کودک (ماژول Children) فقط «child:{id}».
 */
class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'],
            'locale' => $data['locale'] ?? 'fa',
        ])->assignRole(Role::PARENT);

        event(new Registered($user));

        return response()->json([
            'user' => UserResource::make($user->load('roles')),
            'token' => $this->issueToken($user, $data['device_name'] ?? 'web'),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', strtolower($request->string('email')))->first();

        if (! $user || ! Hash::check($request->string('password'), $user->password)) {
            throw ValidationException::withMessages(['email' => [__('auth.failed')]]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages(['email' => ['این حساب غیرفعال است.']]);
        }

        return response()->json([
            'user' => UserResource::make($user->load('roles')),
            'token' => $this->issueToken($user, $request->input('device_name', 'web')),
        ]);
    }

    public function me(Request $request): UserResource
    {
        return UserResource::make($request->user()->load('roles'));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'خارج شدید.']);
    }

    private function issueToken(User $user, string $device): string
    {
        return $user->createToken("parent:$device", ['parent'], now()->addDays(30))->plainTextToken;
    }
}
