import React from 'react';
import { useListingsViewPreference } from '../../hooks/useListingsViewPreference';
import { Listing } from '../../types';
import ListingsGridView from './ListingsGridView';
import ListingsListView from './ListingsListView';
import ListingsViewToggle from './ListingsViewToggle';

interface ListingsViewProps {
  listings: Listing[];
  onMapView: () => void;
  totalListings: number;
}

const ListingsView: React.FC<ListingsViewProps> = ({ listings, onMapView, totalListings }) => {
  const [viewMode, setViewMode] = useListingsViewPreference('grid');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {totalListings} Properties Found
        </h2>
        <ListingsViewToggle
          currentView={viewMode}
          onViewChange={setViewMode}
          onMapView={onMapView}
        />
      </div>

      {viewMode === 'grid' ? (
        <ListingsGridView listings={listings} />
      ) : (
        <ListingsListView listings={listings} />
      )}
    </div>
  );
};

export default ListingsView;
