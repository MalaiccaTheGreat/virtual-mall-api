<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PriceHistory extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'price_history';

    protected $fillable = [
        'priceable_id',
        'priceable_type',
        'old_price',
        'new_price',
        'old_sale_price',
        'new_sale_price',
        'changed_by',
        'reason',
    ];

    protected $casts = [
        'old_price' => 'decimal:2',
        'new_price' => 'decimal:2',
        'old_sale_price' => 'decimal:2',
        'new_sale_price' => 'decimal:2',
        'changed_at' => 'datetime',
    ];
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public function priceable(): MorphTo
    {
        return $this->morphTo();
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * Log a price change for a priceable model.
     *
     * @param  mixed  $priceable  The model instance (Product or ProductVariation)
     * @param  float  $oldPrice  The old price
     * @param  float|null  $newPrice  The new price (null to use the priceable's current price)
     * @param  string  $reason  The reason for the price change
     * @param  int|null  $changedById  The ID of the user who made the change (null for system)
     * @param  float|null  $oldSalePrice  The old sale price (optional)
     * @param  float|null  $newSalePrice  The new sale price (optional)
     * @return self
     */
    public static function logPriceChange(
        $priceable,
        float $oldPrice,
        ?float $newPrice = null,
        string $reason = 'Price updated',
        ?int $changedById = null,
        ?float $oldSalePrice = null,
        ?float $newSalePrice = null
    ): self {
        // If newPrice is null, use the current price from the priceable model
        $newPrice = $newPrice ?? $priceable->price;
        
        // Only log if there's an actual price change
        if ($oldPrice != $newPrice || $oldSalePrice != $newSalePrice) {
            return self::create([
                'priceable_id' => $priceable->id,
                'priceable_type' => get_class($priceable),
                'old_price' => $oldPrice,
                'new_price' => $newPrice,
                'old_sale_price' => $oldSalePrice,
                'new_sale_price' => $newSalePrice,
                'changed_by' => $changedById,
                'reason' => $reason,
                'changed_at' => now(),
            ]);
        }
        
        // Return existing instance if no change
        return new static;
    }
}
