<?php

namespace App\Modules\Identity\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email:rfc', 'max:190', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'regex:/^\+?[0-9]{10,15}$/', 'unique:users,phone'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            // ثبت‌نام فقط توسط بزرگسال و با پذیرش قوانین و سیاست حریم خصوصی کودکان
            'accept_terms' => ['accepted'],
            'locale' => ['nullable', 'in:fa,en'],
            'device_name' => ['nullable', 'string', 'max:60'],
        ];
    }
}
