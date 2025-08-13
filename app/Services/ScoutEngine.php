<?php

namespace App\Services;

use Algolia\AlgoliaSearch\SearchClient;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Laravel\Scout\Builder;
use Laravel\Scout\Engines\Engine;

class ScoutEngine extends Engine
{
    protected $client;

    public function __construct()
    {
        $this->client = SearchClient::create(
            config('scout.algolia.id'),
            config('scout.algolia.secret')
        );
    }

    public function update($models)
    {
        $index = $this->client->initIndex($models->first()->searchableAs());
        $index->saveObjects($models->map->toSearchableArray()->all());
    }

    public function delete($models)
    {
        $index = $this->client->initIndex($models->first()->searchableAs());
        $index->deleteObjects($models->map->getScoutKey()->all());
    }

    public function search(Builder $builder)
    {
        return $this->client->initIndex($builder->index ?? $builder->model->searchableAs())
            ->search($builder->query);
    }

    public function paginate(Builder $builder, $perPage, $page)
    {
        return $this->client->initIndex($builder->index ?? $builder->model->searchableAs())
            ->search($builder->query, [
                'hitsPerPage' => $perPage,
                'page' => $page - 1,
            ]);
    }

    public function mapIds($results)
    {
        return collect($results['hits'])->pluck('objectID');
    }

    public function map(Builder $builder, $results, $model)
    {
        if (count($results['hits']) === 0) {
            return EloquentCollection::make();
        }

        return $model->getScoutModelsByIds(
            $builder,
            $this->mapIds($results)->all()
        );
    }

    public function getTotalCount($results)
    {
        return $results['nbHits'];
    }

    public function flush($model)
    {
        $this->client->initIndex($model->searchableAs())->clearObjects();
    }
}