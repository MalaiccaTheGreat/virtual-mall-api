
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TryOnItem extends Model
{
    protected $fillable = [
        'try_on_session_id',
        'product_id',
        'clothing_category', // 'top', 'bottom', 'shoes', 'accessories', 'full_outfit'
        'position_data',
        'size',
        'color_variant'
    ];

    protected $casts = [
        'position_data' => 'array'
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(TryOnSession::class, 'try_on_session_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
