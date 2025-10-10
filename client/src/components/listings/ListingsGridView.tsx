import React from 'react';
import { Listing } from '../../types';
import ListingCard from './ListingCard';

interface ListingsGridViewProps {
  listings: Listing[];
}

const ListingsGridView: React.FC<ListingsGridViewProps> = ({ listings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingsGridView;
