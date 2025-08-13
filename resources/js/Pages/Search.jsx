import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Pagination } from 'react-instantsearch';
import ProductList from '../components/ProductList';

// Initialize Algolia client
const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);

export default function Search() {
  const [query, setQuery] = useState('');

  return (
    <React.Fragment>
      <Head title="Search" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <InstantSearch searchClient={searchClient} indexName="products">
                <div className="mb-6">
                  <SearchBox
                    translations={{
                      placeholder: 'Search products...'
                    }}
                    onChange={(event) => setQuery(event.currentTarget.value)}
                  />
                </div>

                <div className="mb-6">
                  <Hits
                    hitComponent={({ hit }) => (
                      <ProductList products={[hit]} />
                    )}
                  />
                </div>

                <Pagination />
              </InstantSearch>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
