<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model implements HasMedia
{
    use Searchable, InteractsWithMedia, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'price',
        'image_path',
        'description',
        'category',
        'clothing_category',
        'available_sizes',
        'color_variants',
        'try_on_model_path',
<<<<<<< HEAD
        'is_try_on_enabled',
        'store_id',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

=======
        'is_try_on_enabled'
    ];

>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'price_kwacha' => 'float',
        'price_usd' => 'float',
        'available_sizes' => 'array',
        'color_variants' => 'array',
        'is_try_on_enabled' => 'boolean'
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
}
