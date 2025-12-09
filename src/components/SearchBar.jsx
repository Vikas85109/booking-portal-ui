import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import './SearchBar.css';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, filters, updateFilters } = useBooking();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="search-section">
      <div className="search-header">
        <h1>Find your perfect stay</h1>
        <p>Discover unique accommodations around the world</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-field">
          <MapPin className="search-icon" />
          <input
            type="text"
            placeholder="Where are you going?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="search-divider" />

        <div className="search-field">
          <Calendar className="search-icon" />
          <input
            type="date"
            placeholder="Check in"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div className="search-divider" />

        <div className="search-field">
          <Calendar className="search-icon" />
          <input
            type="date"
            placeholder="Check out"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div className="search-divider" />

        <div className="search-field">
          <Users className="search-icon" />
          <select
            value={filters.guests}
            onChange={(e) => updateFilters({ guests: parseInt(e.target.value) })}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="search-btn">
          <Search size={20} />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
