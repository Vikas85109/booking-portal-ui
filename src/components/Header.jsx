import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Menu, X, User, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlist, bookingHistory } = useBooking();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const upcomingCount = bookingHistory.filter(b =>
    b.status === 'confirmed' && new Date(b.checkIn) > new Date()
  ).length;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <Home className="logo-icon" />
          <span>StayBooker</span>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore
          </Link>
          <Link
            to="/my-bookings"
            className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <CalendarDays className="nav-icon" />
            My Bookings
            {upcomingCount > 0 && (
              <span className="bookings-badge">{upcomingCount}</span>
            )}
          </Link>
          <Link
            to="/wishlist"
            className={`nav-link wishlist-link ${isActive('/wishlist') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Heart className="nav-icon" />
            Wishlist
            {wishlist.length > 0 && (
              <span className="wishlist-badge">{wishlist.length}</span>
            )}
          </Link>
          <button type="button" className="profile-btn">
            <User size={20} />
          </button>
        </nav>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
