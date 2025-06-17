<?php

require __DIR__.'/vendor/autoload.php';

// Print the actual values to verify they're loaded
echo "Testing Algolia credentials:\n";
echo "SCOUT_DRIVER=" . getenv('SCOUT_DRIVER') . "\n";
echo "ALGOLIA_APP_ID=" . getenv('ALGOLIA_APP_ID') . "\n";
echo "ALGOLIA_SECRET=" . (getenv('ALGOLIA_SECRET') ? 'is set' : 'not set') . "\n";

$client = new \Algolia\AlgoliaSearch\SearchClient(
    getenv('ALGOLIA_APP_ID'),
    getenv('ALGOLIA_SECRET')
);

print_r($client->listIndices());
