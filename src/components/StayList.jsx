import { useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { stays } from '../data/stays';
import StayCard from './StayCard';
import './StayList.css';

const StayList = () => {
  const { searchQuery, filters } = useBooking();

  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          stay.title.toLowerCase().includes(query) ||
          stay.location.toLowerCase().includes(query) ||
          stay.type.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location !== 'All Locations') {
        if (!stay.location.includes(filters.location)) return false;
      }

      // Property type filter
      if (filters.propertyType !== 'All Types') {
        if (stay.type !== filters.propertyType) return false;
      }

      // Price filter
      if (
        stay.price < filters.priceRange[0] ||
        stay.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Rating filter
      if (stay.rating < filters.rating) return false;

      // Guests filter
      if (stay.guests < filters.guests) return false;

      return true;
    });
  }, [searchQuery, filters]);

  return (
    <div className="stay-list-container">
      <div className="stay-list-header">
        <h2>
          {filteredStays.length} {filteredStays.length === 1 ? 'stay' : 'stays'} found
        </h2>
      </div>

      {filteredStays.length > 0 ? (
        <div className="stay-grid">
          {filteredStays.map((stay) => (
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">🏠</div>
          <h3>No stays found</h3>
          <p>Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default StayList;
