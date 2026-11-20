<?php

namespace Tests\Feature;

use App\Modules\Games\Models\CustomGame;
use Tests\TestCase;

/** بازی‌ساز والدین: ساخت، دسترسی خانواده، اعتبارسنجی */
class CustomGameTest extends TestCase
{
    private function train(array $over = []): array
    {
        return array_replace_recursive([
            'title' => 'قطار سه‌رنگ', 'gameType' => 'pattern', 'tone' => 'sun',
            'config' => ['unit' => ['circle-red', 'square-blue', 'triangle-green'], 'wagons' => 10, 'shown' => 6],
        ], $over);
    }

    public function test_parent_builds_edits_and_deletes_games(): void
    {
        $parent = $this->parent();
        $h = $this->bearer($this->parentToken($parent));

        $id = $this->postJson('/api/v1/parent/custom-games', $this->train(), $h)->assertCreated()
            ->assertJsonPath('data.gameType', 'pattern')->assertJsonPath('data.config.wagons', 10)
            ->assertJsonPath('data.config.unit.2', 'triangle-green')->json('data.id');

        $this->postJson('/api/v1/parent/custom-games', [
            'title' => 'تنگ ماهی', 'gameType' => 'counting', 'config' => ['counts' => [15, 3, 9], 'icon' => 'fish'],
        ], $h)->assertCreated()->assertJsonPath('data.config.counts', [15, 3, 9]);

        $this->putJson("/api/v1/parent/custom-games/{$id}", $this->train(['title' => 'قطار ۱۲ واگنی', 'config' => ['wagons' => 12]]), $h)
            ->assertOk()->assertJsonPath('data.title', 'قطار ۱۲ واگنی')->assertJsonPath('data.config.wagons', 12);

        $this->getJson('/api/v1/parent/custom-games', $h)->assertOk()->assertJsonCount(2, 'data');
        $this->deleteJson("/api/v1/parent/custom-games/{$id}", [], $h)->assertNoContent();
        $this->getJson('/api/v1/parent/custom-games', $h)->assertJsonCount(1, 'data');
    }

    public function test_children_see_only_their_family_games_and_assigned_ones(): void
    {
        $parent = $this->parent();
        $nila = $this->child($parent, 6);
        $arin = $this->child($parent, 4);
        $h = $this->bearer($this->parentToken($parent));
        $this->postJson('/api/v1/parent/custom-games', $this->train(), $h)->assertCreated();
        $this->postJson('/api/v1/parent/custom-games', $this->train(['title' => 'فقط آرین', 'childIds' => [$arin->id]]), $h)->assertCreated();

        $nilaToken = $this->postJson("/api/v1/children/{$nila->id}/session", [], $h)->json('token');
        $this->getJson("/api/v1/children/{$nila->id}/custom-games", $this->bearer($nilaToken))->assertOk()->assertJsonCount(1, 'data');
        $this->getJson("/api/v1/children/{$arin->id}/custom-games", $this->bearer($this->parentToken($parent)))->assertJsonCount(2, 'data');

        // توکن کودک اجازه‌ی ساخت/ویرایش ندارد و کودک خانواده‌ی دیگر را نمی‌بیند
        $this->postJson('/api/v1/parent/custom-games', $this->train(), $this->bearer($nilaToken))->assertForbidden();
        $this->getJson("/api/v1/children/{$arin->id}/custom-games", $this->bearer($nilaToken))->assertForbidden();
        $other = $this->parent();
        $this->getJson("/api/v1/children/{$nila->id}/custom-games", $this->bearer($this->parentToken($other)))->assertForbidden();
        $game = CustomGame::first();
        $this->deleteJson("/api/v1/parent/custom-games/{$game->id}", [], $this->bearer($this->parentToken($other)))->assertNotFound();
    }

    public function test_configs_are_validated_per_game_type(): void
    {
        $h = $this->bearer($this->parentToken($this->parent()));
        // واگن نمایش‌داده‌شده باید کمتر از کل و دست‌کم یک دور الگو باشد
        $this->postJson('/api/v1/parent/custom-games', $this->train(['config' => ['shown' => 10]]), $h)->assertUnprocessable()->assertJsonValidationErrors('config.shown');
        $this->postJson('/api/v1/parent/custom-games', $this->train(['config' => ['wagons' => 20]]), $h)->assertJsonValidationErrors('config.wagons');
        $this->postJson('/api/v1/parent/custom-games', $this->train(['config' => ['unit' => ['circle-red', 'hexagon-red']]]), $h)->assertJsonValidationErrors('config.unit.1');
        $this->postJson('/api/v1/parent/custom-games', ['title' => 'x', 'gameType' => 'counting', 'config' => ['counts' => [16]]], $h)->assertJsonValidationErrors('config.counts.0');
        $this->postJson('/api/v1/parent/custom-games', ['title' => 'x', 'gameType' => 'memory', 'config' => ['icons' => ['cat', 'cat']]], $h)->assertJsonValidationErrors('config.icons.0');
        $this->postJson('/api/v1/parent/custom-games', ['title' => 'x', 'gameType' => 'chess', 'config' => []], $h)->assertJsonValidationErrors('gameType');
        // کودک ناشناس در childIds نادیده گرفته می‌شود
        $this->postJson('/api/v1/parent/custom-games', $this->train(['childIds' => [999999]]), $h)->assertCreated()->assertJsonPath('data.childIds', null);
    }
}
