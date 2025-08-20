<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Algolia\AlgoliaSearch\SearchClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('scout.engine', function() {
            $client = SearchClient::create(
                config('scout.algolia.id'),
                config('scout.algolia.secret')
            );
            
            return new class($client) {
                protected $client;
                
                public function __construct($client) {
                    $this->client = $client;
                }
                
                public function search($query) {
                    return $this->client->initIndex('products')->search($query);
                }
                
                // Required methods
                public function update($models) {
                    $this->client->initIndex($models->first()->searchableAs())
                        ->saveObjects($models->map->toSearchableArray()->all());
                }
                
                public function getClient() {
                    return $this->client;
                }
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
