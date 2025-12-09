import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { stays } from '../data/stays';
import StayCard from '../components/StayCard';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist } = useBooking();

  const wishlistStays = stays.filter((stay) => wishlist.includes(stay.id));

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>
          <Heart size={28} fill="#ef4444" stroke="#ef4444" />
          Your Wishlist
        </h1>
        <p>{wishlistStays.length} saved {wishlistStays.length === 1 ? 'stay' : 'stays'}</p>
      </div>

      {wishlistStays.length > 0 ? (
        <div className="wishlist-grid">
          {wishlistStays.map((stay) => (
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>
      ) : (
        <div className="wishlist-empty">
          <div className="empty-icon">
            <Heart size={64} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Start saving your favorite stays by clicking the heart icon on any listing</p>
          <Link to="/" className="browse-btn">
            Browse stays
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
