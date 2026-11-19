<?php

namespace App\Modules\Shared\Http;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * قالب صفحه‌بندی هم‌خوان با تایپ Paginated<T> در @kidsworld/types:
 * { data: T[], meta: { page, perPage, total } }
 */
final class Paginated
{
    /** @param class-string<JsonResource> $resource */
    public static function response(LengthAwarePaginator $paginator, string $resource): JsonResponse
    {
        return response()->json([
            'data' => $resource::collection($paginator->items())->resolve(),
            'meta' => [
                'page' => $paginator->currentPage(),
                'perPage' => $paginator->perPage(),
                'total' => $paginator->total(),
                'lastPage' => $paginator->lastPage(),
            ],
        ]);
    }
}
