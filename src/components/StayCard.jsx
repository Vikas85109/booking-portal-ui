import { Heart, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import './StayCard.css';

const StayCard = ({ stay }) => {
  const { addToWishlist, isInWishlist } = useBooking();
  const inWishlist = isInWishlist(stay.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(stay.id);
  };

  return (
    <Link to={`/stay/${stay.id}`} className="stay-card">
      <div className="stay-card-image">
        <img src={stay.images[0]} alt={stay.title} />
        <button
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} />
        </button>
        <span className="stay-type-badge">{stay.type}</span>
      </div>
      <div className="stay-card-content">
        <div className="stay-card-header">
          <h3 className="stay-title">{stay.title}</h3>
          <div className="stay-rating">
            <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
            <span>{stay.rating}</span>
            <span className="reviews-count">({stay.reviews})</span>
          </div>
        </div>
        <div className="stay-location">
          <MapPin size={14} />
          <span>{stay.location}</span>
        </div>
        <div className="stay-card-details">
          <span>{stay.bedrooms} beds</span>
          <span className="dot">·</span>
          <span>{stay.bathrooms} baths</span>
          <span className="dot">·</span>
          <span>{stay.guests} guests</span>
        </div>
        <div className="stay-footer">
          <div className="stay-price">
            <span className="price">${stay.price}</span>
            <span className="per-night">/ night</span>
          </div>
          {stay.host.superhost && (
            <span className="superhost-badge">Superhost</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StayCard;
