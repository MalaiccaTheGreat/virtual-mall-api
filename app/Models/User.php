<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'storefront_id',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_admin' => 'boolean',
    ];

    /**
     * Get the storefront owned by the user.
     */
    public function storefront()
    {
        return $this->hasOne(Storefront::class, 'owner_id');
    }

    /**
     * Get the price changes made by the user.
     */
    public function priceChanges()
    {
        return $this->hasMany(PriceHistory::class, 'changed_by');
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin' || $this->is_admin === true;
    }

    /**
     * Check if the user is a store owner.
     */
    public function isStoreOwner(): bool
    {
        return $this->role === 'store_owner' || $this->storefront()->exists();
    }
}