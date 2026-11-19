<?php

namespace App\Modules\Subscriptions\Gateways;

use RuntimeException;

/** خطای ارتباط یا پاسخ نامعتبر درگاه؛ پیام آن برای نمایش به والد مناسب است */
class PaymentGatewayException extends RuntimeException {}
