<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\ProductVariation;
use App\Models\PriceHistory;

class Product extends Model implements HasMedia
{
    use Searchable, InteractsWithMedia, HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'storefront_id',
        'description',
        'category',
        'price',
        'sale_price',
        'sku',
        'barcode',
        'is_featured',
        'is_active',
        'attributes',
        'image_path',
        'clothing_category',
        'available_sizes',
        'color_variants',
        'try_on_model_path',
        'is_try_on_enabled',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'slug',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'price_kwacha' => 'float',
        'price_usd' => 'float',
        'available_sizes' => 'array',
        'color_variants' => 'array',
        'is_try_on_enabled' => 'boolean',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'attributes' => 'array',
    ];

    /**
     * Accessor for price formatting.
     */
    public function getPriceAttribute($value)
    {
        return number_format($value, 2);
    }

    /**
     * Get the name of the index associated with the model for Scout.
     */
    public function searchableAs(): string
    {
        return 'products_index';
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->stock_quantity > 0;
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'description' => strip_tags($this->description),
            'sku' => $this->sku,
            'in_stock' => $this->stock_quantity > 0,
            'media' => $this->getMediaUrls(),
            'created_at' => $this->created_at->timestamp,
        ];
    }

    /**
     * Register media collections and conversions.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('products')
             ->useDisk('s3')
             ->singleFile();

        $this->addMediaCollection('product_gallery')
             ->useDisk('s3');
    }

    /**
     * Register media conversions.
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
             ->width(300)
             ->height(300)
             ->nonQueued();

        $this->addMediaConversion('large')
             ->width(800)
             ->height(800);
    }

    /**
     * Get all media URLs for search indexing.
     *
     * @return array<string>
     */
    protected function getMediaUrls(): array
    {
        return $this->getMedia()
            ->map(fn (Media $media) => [
                'url' => $media->getFullUrl(),
                'thumb' => $media->getFullUrl('thumb'),
                'alt' => $media->getCustomProperty('alt', ''),
            ])
            ->toArray();
    }

    /**
     * Laravel 9+ Attribute-style accessor (optional, not needed if using getPriceAttribute).
     */
    protected function price(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => number_format($value, 2),
        );
    }

    /**
     * Scope for in-stock products.
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function features(): HasMany
    {
        return $this->hasMany(ProductFeature::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function getMainImageAttribute()
    {
        return $this->images()->where('is_main', true)->first()?->url ?? $this->image_url;
    }

    public function getFormattedKwachaPrice()
    {
        return 'K' . number_format($this->price_kwacha, 2);
    }

    public function getFormattedUsdPrice()
    {
        return '$' . number_format($this->price_usd, 2);
    }

    /**
     * Get the storefront that owns the product.
     */
    public function storefront(): BelongsTo
    {
        return $this->belongsTo(Storefront::class);
    }

    /**
     * Get all variations for the product.
     */
    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }


    /**
     * Get the price history for the product.
     */
    public function priceHistory(): MorphMany
    {
        return $this->morphMany(PriceHistory::class, 'priceable');
    }

    /**
     * Scope a query to only include active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Get the URL to the product's main image.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('products', 'large') ?: 
               $this->getFirstMediaUrl('product_gallery', 'large');
    }

    /**
     * Get the URL to the product's thumbnail image.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('products', 'thumb') ?: 
               $this->getFirstMediaUrl('product_gallery', 'thumb');
    }

    /**
     * Get the product's current price (sale price if available, otherwise regular price).
     */
    public function getCurrentPriceAttribute()
    {
        return $this->sale_price ?? $this->price;
    }

    /**
     * Check if the product is on sale.
     */
    public function getIsOnSaleAttribute(): bool
    {
        return !is_null($this->sale_price) && $this->sale_price < $this->price;
    }

    /**
     * Get the discount percentage if the product is on sale.
     */
    public function getDiscountPercentageAttribute(): ?int
    {
        if (!$this->is_on_sale) {
            return null;
        }

        return (int) round((($this->price - $this->sale_price) / $this->price) * 100);
    }

    /**
     * Get the default variation for the product.
     */
    public function defaultVariation(): ?ProductVariation
    {
        return $this->variations()->where('is_default', true)->first() ?? $this->variations->first();
    }

    /**
     * Check if the product has variations.
     */
    public function hasVariations(): bool
    {
        return $this->variations->count() > 1;
    }

    /**
     * Get the lowest price from all variations.
     */
    public function getLowestPriceAttribute(): float
    {
        if ($this->hasVariations()) {
            return $this->variations->min('price');
        }

        return $this->price;
    }

    /**
     * Get the highest price from all variations.
     */
    public function getHighestPriceAttribute(): float
    {
        if ($this->hasVariations()) {
            return $this->variations->max('price');
        }

        return $this->price;
    }

    /**
     * Get the lowest sale price from all variations.
     */
    public function getLowestSalePriceAttribute(): ?float
    {
        if ($this->hasVariations()) {
            return $this->variations->filter(fn($v) => $v->sale_price !== null)->min('sale_price');
        }

        return $this->sale_price;
    }

    /**
     * Get the available colors from variations.
     */
    public function getAvailableColorsAttribute(): array
    {
        if ($this->hasVariations()) {
            return $this->variations->pluck('color')->filter()->unique()->values()->toArray();
        }

        return [];
    }

    /**
     * Get the available sizes from variations.
     */
    public function getAvailableSizesAttribute(): array
    {
        if ($this->hasVariations()) {
            return $this->variations->pluck('size')->filter()->unique()->values()->toArray();
        }

        return [];
    }

    /**
     * Scope a query to only include products with variations.
     */
    public function scopeWithVariations($query)
    {
        return $query->whereHas('variations');
    }

    /**
     * Scope a query to only include products on sale.
     */
    public function scopeOnSale($query)
    {
        return $query->whereNotNull('sale_price')
            ->orWhereHas('variations', function($q) {
                $q->whereNotNull('sale_price');
            });
    }
}
