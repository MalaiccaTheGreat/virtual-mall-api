<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\PriceHistory;

class ProductVariation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'product_id',
        'sku',
        'color',
        'size',
        'material',
        'style',
        'price',
        'sale_price',
        'stock_quantity',
        'barcode',
        'image_url',
        'is_default',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'is_default' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getCurrentPriceAttribute()
    {
        return $this->sale_price ?? $this->price;
    }

    public function isInStock(): bool
    {
        return $this->stock_quantity > 0;
    }

    /**
     * Check if the variation is on sale.
     */
    public function getIsOnSaleAttribute(): bool
    {
        return $this->sale_price !== null && $this->sale_price < $this->price;
    }

    /**
     * Get the discount percentage if the variation is on sale.
     */
    public function getDiscountPercentageAttribute(): ?int
    {
        if (!$this->is_on_sale) {
            return null;
        }

        return (int) round((($this->price - $this->sale_price) / $this->price) * 100);
    }

    /**
     * Get the price history for this variation.
     */
    public function priceHistory(): MorphMany
    {
        return $this->morphMany(PriceHistory::class, 'priceable');
    }

    /**
     * Set this variation as the default for its product.
     */
    public function setAsDefault(): bool
    {
        // First, unset any existing default for this product
        $this->product->variations()->update(['is_default' => false]);
        
        // Then set this one as default
        return $this->update(['is_default' => true]);
    }

    /**
     * Get the display name for this variation.
     * Combines color, size, and material if available.
     */
    public function getDisplayNameAttribute(): string
    {
        $parts = [];
        
        if ($this->color) {
            $parts[] = ucfirst($this->color);
        }
        
        if ($this->size) {
            $parts[] = strtoupper($this->size);
        }
        
        if ($this->material) {
            $parts[] = ucfirst($this->material);
        }
        
        return implode(' / ', $parts) ?: 'Default';
    }

    /**
     * Scope a query to only include default variations.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope a query to only include variations that are in stock.
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    /**
     * Scope a query to only include variations on sale.
     */
    public function scopeOnSale($query)
    {
        return $query->whereNotNull('sale_price')
                    ->whereColumn('sale_price', '<', 'price');
    }

}
