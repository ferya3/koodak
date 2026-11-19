<?php

namespace App\Modules\Children\Policies;

use App\Models\User;
use App\Modules\Children\Models\ChildProfile;

/** کنترل مالکیت: هر والد فقط به فرزندان خودش دسترسی دارد */
class ChildProfilePolicy
{
    public function view(User $user, ChildProfile $child): bool
    {
        return $child->parent_user_id === $user->id;
    }

    public function update(User $user, ChildProfile $child): bool
    {
        return $this->view($user, $child);
    }

    public function delete(User $user, ChildProfile $child): bool
    {
        return $this->view($user, $child);
    }
}
