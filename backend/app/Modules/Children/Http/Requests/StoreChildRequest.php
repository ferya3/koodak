<?php

namespace App\Modules\Children\Http\Requests;

use App\Modules\Children\Models\ChildProfile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreChildRequest extends FormRequest
{
    public function rules(): array
    {
        $isCreate = $this->isMethod('post');

        return [
            'display_name' => [$isCreate ? 'required' : 'sometimes', 'string', 'min:2', 'max:40'],
            // فقط سال و ماه؛ کودک بین ۲ تا ۱۰ سال (با کمی بازه)
            'birth_year_month' => [
                $isCreate ? 'required' : 'sometimes', 'date_format:Y-m',
                function (string $attr, mixed $value, \Closure $fail) {
                    $d = \DateTimeImmutable::createFromFormat('!Y-m', (string) $value);
                    $age = $d ? $d->diff(new \DateTimeImmutable('first day of this month'))->y : -1;
                    if ($d === false || $d > new \DateTimeImmutable || $age < 1 || $age > 12) {
                        $fail('سن کودک باید بین ۱ تا ۱۲ سال باشد.');
                    }
                },
            ],
            'avatar' => [$isCreate ? 'required' : 'sometimes', Rule::in(ChildProfile::AVATARS)],
            'preferred_language' => ['sometimes', 'in:fa,en'],
            'favorite_category_ids' => ['sometimes', 'array', 'max:10'],
            'favorite_category_ids.*' => ['integer', 'exists:categories,id'],
            // رضایت صریح والد هنگام ساخت پروفایل
            'consent' => [$isCreate ? 'accepted' : 'prohibited'],
        ];
    }

    public function messages(): array
    {
        return ['consent.accepted' => 'برای ساخت پروفایل کودک، پذیرش رضایت‌نامه‌ی والدین الزامی است.'];
    }
}
