<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Debug environment variables
echo "SCOUT_DRIVER: " . env('SCOUT_DRIVER') . "\n";
echo "ALGOLIA_APP_ID: " . (env('ALGOLIA_APP_ID') ? 'is set' : 'not set') . "\n";
echo "ALGOLIA_SECRET: " . (env('ALGOLIA_SECRET') ? 'is set' : 'not set') . "\n\n";

echo "Scout engine bound: " . (app()->bound('scout.engine') ? 'true' : 'false') . "\n";

try {
    $engine = app('scout.engine');
    echo "Engine class: " . get_class($engine) . "\n";
    
    $result = $engine->search(new \Laravel\Scout\Builder(new class { 
        use \Laravel\Scout\Searchable;
        public function searchableAs() { return 'test_index'; }
    }, 'test'));
    
    echo "\nSearch result:\n";
    var_dump($result);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
} 