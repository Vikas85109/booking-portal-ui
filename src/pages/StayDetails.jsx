import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Snowflake,
  Waves,
  Flame,
  Coffee,
  Utensils,
  Dumbbell,
  ChefHat,
  TreePine,
  Mountain,
  Anchor
} from 'lucide-react';
import { stays } from '../data/stays';
import { useBooking } from '../context/BookingContext';
import ImageGallery from '../components/ImageGallery';
import BookingCard from '../components/BookingCard';
import MapSection from '../components/MapSection';
import './StayDetails.css';

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  'Air Conditioning': Snowflake,
  Pool: Waves,
  Fireplace: Flame,
  'Hot Tub': Coffee,
  Kitchen: Utensils,
  Gym: Dumbbell,
  'Gym Access': Dumbbell,
  'Chef\'s Kitchen': ChefHat,
  'Mountain Views': Mountain,
  'Beach Access': Anchor,
  'Lake Access': Anchor,
  Deck: TreePine,
  BBQ: Flame,
  'Fire Pit': Flame
};

const StayDetails = () => {
  const { id } = useParams();
  const { addToWishlist, isInWishlist } = useBooking();

  const stay = stays.find((s) => s.id === parseInt(id));

  if (!stay) {
    return (
      <div className="stay-not-found">
        <h2>Stay not found</h2>
        <Link to="/">Go back home</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(stay.id);

  return (
    <div className="stay-details">
      <div className="details-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to listings</span>
        </Link>

        <div className="header-actions">
          <button className="action-btn">
            <Share2 size={18} />
            <span>Share</span>
          </button>
          <button
            className={`action-btn ${inWishlist ? 'active' : ''}`}
            onClick={() => addToWishlist(stay.id)}
          >
            <Heart size={18} fill={inWishlist ? '#ef4444' : 'none'} />
            <span>{inWishlist ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      <h1 className="stay-title">{stay.title}</h1>

      <div className="stay-meta">
        <div className="meta-item">
          <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
          <span className="rating">{stay.rating}</span>
          <span className="reviews">({stay.reviews} reviews)</span>
        </div>
        <span className="meta-dot">·</span>
        {stay.host.superhost && (
          <>
            <span className="superhost-badge">Superhost</span>
            <span className="meta-dot">·</span>
          </>
        )}
        <div className="meta-item">
          <MapPin size={16} />
          <span>{stay.location}</span>
        </div>
      </div>

      <ImageGallery images={stay.images} title={stay.title} />

      <div className="details-content">
        <div className="details-main">
          <div className="host-section">
            <div className="host-info">
              <h2>
                {stay.type} hosted by {stay.host.name}
              </h2>
              <div className="property-specs">
                <span>
                  <Users size={16} />
                  {stay.guests} guests
                </span>
                <span>
                  <Bed size={16} />
                  {stay.bedrooms} bedrooms
                </span>
                <span>
                  <Bath size={16} />
                  {stay.bathrooms} bathrooms
                </span>
              </div>
            </div>
            <div className="host-avatar">
              <img src={stay.host.image} alt={stay.host.name} />
              {stay.host.superhost && <span className="superhost-mark">★</span>}
            </div>
          </div>

          <div className="divider" />

          <div className="highlights-section">
            <div className="highlight">
              <div className="highlight-icon">🏆</div>
              <div className="highlight-text">
                <h4>{stay.host.name} is a Superhost</h4>
                <p>Superhosts are experienced, highly rated hosts.</p>
              </div>
            </div>
            <div className="highlight">
              <div className="highlight-icon">📍</div>
              <div className="highlight-text">
                <h4>Great location</h4>
                <p>95% of recent guests gave the location a 5-star rating.</p>
              </div>
            </div>
            <div className="highlight">
              <div className="highlight-icon">🗓️</div>
              <div className="highlight-text">
                <h4>Free cancellation</h4>
                <p>Full refund if you cancel within 48 hours of booking.</p>
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="description-section">
            <h3>About this place</h3>
            <p>{stay.description}</p>
          </div>

          <div className="divider" />

          <div className="amenities-section">
            <h3>What this place offers</h3>
            <div className="amenities-grid">
              {stay.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <div key={amenity} className="amenity-item">
                    <Icon size={24} />
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <MapSection location={stay.location} coordinates={stay.coordinates} />

          <div className="divider" />

          <div className="reviews-section">
            <h3>
              <Star size={20} fill="#fbbf24" stroke="#fbbf24" />
              {stay.rating} · {stay.reviews} reviews
            </h3>
            <div className="reviews-summary">
              <div className="rating-bar">
                <span>Cleanliness</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '95%' }} />
                </div>
                <span>4.9</span>
              </div>
              <div className="rating-bar">
                <span>Communication</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '98%' }} />
                </div>
                <span>5.0</span>
              </div>
              <div className="rating-bar">
                <span>Check-in</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '96%' }} />
                </div>
                <span>4.9</span>
              </div>
              <div className="rating-bar">
                <span>Accuracy</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '94%' }} />
                </div>
                <span>4.8</span>
              </div>
              <div className="rating-bar">
                <span>Location</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '100%' }} />
                </div>
                <span>5.0</span>
              </div>
              <div className="rating-bar">
                <span>Value</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '92%' }} />
                </div>
                <span>4.7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="details-sidebar">
          <BookingCard stay={stay} />
        </div>
      </div>
    </div>
  );
};

export default StayDetails;
