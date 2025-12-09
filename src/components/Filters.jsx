import { SlidersHorizontal, Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { locations, propertyTypes } from '../data/stays';
import './Filters.css';

const Filters = () => {
  const { filters, updateFilters, resetFilters } = useBooking();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 600 ||
    filters.rating > 0 ||
    filters.location !== 'All Locations' ||
    filters.propertyType !== 'All Types';

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileFilters]);

  const handleMinPriceChange = (value) => {
    const newMin = parseInt(value);
    // Ensure min doesn't exceed max
    if (newMin <= filters.priceRange[1]) {
      updateFilters({ priceRange: [newMin, filters.priceRange[1]] });
    }
  };

  const handleMaxPriceChange = (value) => {
    const newMax = parseInt(value);
    // Ensure max doesn't go below min
    if (newMax >= filters.priceRange[0]) {
      updateFilters({ priceRange: [filters.priceRange[0], newMax] });
    }
  };

  const filterContent = (
    <>
      <div className="filter-group">
        <label className="filter-label">Location</label>
        <select
          value={filters.location}
          onChange={(e) => updateFilters({ location: e.target.value })}
          className="filter-select"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Property Type</label>
        <select
          value={filters.propertyType}
          onChange={(e) => updateFilters({ propertyType: e.target.value })}
          className="filter-select"
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </label>
        <div className="price-inputs">
          <div className="price-input-row">
            <span className="price-label">Min</span>
            <input
              type="range"
              min="0"
              max="600"
              step="25"
              value={filters.priceRange[0]}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="price-slider"
            />
            <span className="price-value">${filters.priceRange[0]}</span>
          </div>
          <div className="price-input-row">
            <span className="price-label">Max</span>
            <input
              type="range"
              min="0"
              max="600"
              step="25"
              value={filters.priceRange[1]}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="price-slider"
            />
            <span className="price-value">${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Minimum Rating</label>
        <div className="rating-buttons">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              type="button"
              className={`rating-btn ${filters.rating === rating ? 'active' : ''}`}
              onClick={() => updateFilters({ rating })}
            >
              {rating === 0 ? (
                'Any'
              ) : (
                <>
                  <Star
                    size={14}
                    fill={filters.rating === rating ? 'white' : '#fbbf24'}
                    stroke={filters.rating === rating ? 'white' : '#fbbf24'}
                  />
                  {rating}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button type="button" className="reset-filters-btn" onClick={resetFilters}>
          Clear all filters
        </button>
      )}
    </>
  );

  return (
    <>
      <button
        type="button"
        className="mobile-filter-toggle"
        onClick={() => setShowMobileFilters(true)}
      >
        <SlidersHorizontal size={18} />
        Filters
        {hasActiveFilters && <span className="filter-badge" />}
      </button>

      <aside className="filters-sidebar">
        <div className="filters-header">
          <SlidersHorizontal size={20} />
          <h3>Filters</h3>
        </div>
        {filterContent}
      </aside>

      {showMobileFilters && (
        <div className="mobile-filters-overlay" onClick={() => setShowMobileFilters(false)}>
          <div className="mobile-filters-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-filters-header">
              <h3>Filters</h3>
              <button
                type="button"
                className="close-filters-btn"
                onClick={() => setShowMobileFilters(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="mobile-filters-content">
              {filterContent}
            </div>
            <div className="mobile-filters-footer">
              <button
                type="button"
                className="apply-filters-btn"
                onClick={() => setShowMobileFilters(false)}
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filters;
