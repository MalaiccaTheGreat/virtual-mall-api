
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TryOnSession extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'model_type', // '3d_model' or 'user_photo'
        'user_photo_path',
        'body_measurements',
        'is_active'
    ];

    protected $casts = [
        'body_measurements' => 'array',
        'is_active' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tryOnItems(): HasMany
    {
        return $this->hasMany(TryOnItem::class);
    }
}
