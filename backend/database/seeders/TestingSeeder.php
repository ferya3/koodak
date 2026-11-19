<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/** داده‌ی پایه برای تست‌ها: محتوا، پلن‌ها و مدال‌ها (بدون حساب‌های نمایشی) */
class TestingSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([CatalogSeeder::class, CommerceSeeder::class]);
    }
}
