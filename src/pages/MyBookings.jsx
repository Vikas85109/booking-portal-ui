import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  ChevronRight,
  CalendarDays,
  Home,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import './MyBookings.css';

const MyBookings = () => {
  const { bookingHistory, cancelBooking } = useBooking();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const now = new Date();

  const upcomingBookings = bookingHistory.filter(booking =>
    booking.status === 'confirmed' && new Date(booking.checkIn) > now
  );

  const pastBookings = bookingHistory.filter(booking =>
    new Date(booking.checkOut) < now || booking.status === 'cancelled'
  );

  const handleCancelBooking = async (bookingId) => {
    setCancellingId(bookingId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    cancelBooking(bookingId);
    setCancellingId(null);
  };

  const getStatusBadge = (booking) => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    if (booking.status === 'cancelled') {
      return <span className="status-badge cancelled"><XCircle size={14} /> Cancelled</span>;
    }
    if (checkOut < now) {
      return <span className="status-badge completed"><CheckCircle size={14} /> Completed</span>;
    }
    if (checkIn <= now && checkOut >= now) {
      return <span className="status-badge active"><Clock size={14} /> Active</span>;
    }
    return <span className="status-badge upcoming"><CalendarDays size={14} /> Upcoming</span>;
  };

  const getDaysUntilCheckIn = (checkIn) => {
    const days = Math.ceil((new Date(checkIn) - now) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  const bookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage your reservations and view booking history</p>
        </div>

        <div className="bookings-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <CalendarDays size={18} />
            Upcoming
            {upcomingBookings.length > 0 && (
              <span className="tab-count">{upcomingBookings.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <Clock size={18} />
            Past
            {pastBookings.length > 0 && (
              <span className="tab-count">{pastBookings.length}</span>
            )}
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">
              {activeTab === 'upcoming' ? <Calendar size={64} /> : <Search size={64} />}
            </div>
            <h2>
              {activeTab === 'upcoming'
                ? 'No upcoming bookings'
                : 'No past bookings'
              }
            </h2>
            <p>
              {activeTab === 'upcoming'
                ? "Time to plan your next adventure! Browse our amazing stays and book your dream getaway."
                : "Your completed and cancelled bookings will appear here."
              }
            </p>
            {activeTab === 'upcoming' && (
              <Link to="/" className="browse-btn">
                <Home size={18} />
                Browse Stays
              </Link>
            )}
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className={`booking-item ${booking.status}`}>
                <div className="booking-image">
                  <img src={booking.stay.images[0]} alt={booking.stay.title} />
                  {activeTab === 'upcoming' && booking.status === 'confirmed' && (
                    <div className="days-badge">
                      {getDaysUntilCheckIn(booking.checkIn)}
                    </div>
                  )}
                </div>

                <div className="booking-details">
                  <div className="booking-top">
                    <div className="booking-info">
                      <span className="stay-type">{booking.stay.type}</span>
                      <h3>{booking.stay.title}</h3>
                      <p className="location">
                        <MapPin size={14} />
                        {booking.stay.location}
                      </p>
                    </div>
                    {getStatusBadge(booking)}
                  </div>

                  <div className="booking-dates">
                    <div className="date-block">
                      <span className="date-label">Check-in</span>
                      <span className="date-value">{formatShortDate(booking.checkIn)}</span>
                    </div>
                    <div className="date-arrow">
                      <ChevronRight size={16} />
                      <span>{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</span>
                    </div>
                    <div className="date-block">
                      <span className="date-label">Check-out</span>
                      <span className="date-value">{formatShortDate(booking.checkOut)}</span>
                    </div>
                  </div>

                  <div className="booking-meta">
                    <div className="meta-item">
                      <Users size={14} />
                      <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                    </div>
                    <div className="meta-item">
                      <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                      <span>{booking.stay.rating}</span>
                    </div>
                    <div className="booking-total">
                      <span>Total:</span>
                      <strong>${booking.totalPaid}</strong>
                    </div>
                  </div>

                  <div className="booking-footer">
                    <span className="confirmation-id">
                      Confirmation: {booking.id}
                    </span>

                    <div className="booking-actions">
                      <Link to={`/stay/${booking.stay.id}`} className="view-stay-btn">
                        View Stay
                      </Link>

                      {activeTab === 'upcoming' && booking.status === 'confirmed' && (
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                        >
                          {cancellingId === booking.id ? (
                            <>
                              <span className="spinner-small" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle size={16} />
                              Cancel
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {bookings.length > 0 && (
          <div className="bookings-summary">
            <div className="summary-stat">
              <span className="stat-value">{bookingHistory.length}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">{upcomingBookings.length}</span>
              <span className="stat-label">Upcoming</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">
                ${bookingHistory.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.totalPaid : 0), 0)}
              </span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
