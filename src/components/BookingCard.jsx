import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Star, AlertCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import './BookingCard.css';

const BookingCard = ({ stay }) => {
  const navigate = useNavigate();
  const { startBooking } = useBooking();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const subtotal = stay.price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  const handleCheckInChange = (value) => {
    setCheckIn(value);
    setError('');
    // If check-out is before new check-in, reset it
    if (checkOut && value >= checkOut) {
      setCheckOut('');
    }
  };

  const handleCheckOutChange = (value) => {
    setCheckOut(value);
    setError('');
  };

  const handleReserve = () => {
    if (!checkIn) {
      setError('Please select a check-in date');
      return;
    }
    if (!checkOut) {
      setError('Please select a check-out date');
      return;
    }
    if (nights === 0) {
      setError('Check-out must be after check-in');
      return;
    }

    startBooking(stay, new Date(checkIn), new Date(checkOut), guests);
    navigate('/booking');
  };

  // Calculate minimum checkout date (day after check-in)
  const getMinCheckOut = () => {
    if (!checkIn) return today;
    const [year, month, day] = checkIn.split('-').map(Number);
    const checkInDate = new Date(year, month - 1, day);
    checkInDate.setDate(checkInDate.getDate() + 1);
    const nextYear = checkInDate.getFullYear();
    const nextMonth = String(checkInDate.getMonth() + 1).padStart(2, '0');
    const nextDay = String(checkInDate.getDate()).padStart(2, '0');
    return `${nextYear}-${nextMonth}-${nextDay}`;
  };

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div className="booking-price">
          <span className="price-amount">${stay.price}</span>
          <span className="price-night">/ night</span>
        </div>
        <div className="booking-rating">
          <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
          <span>{stay.rating}</span>
          <span className="reviews">({stay.reviews} reviews)</span>
        </div>
      </div>

      <div className="booking-form">
        <div className="date-inputs">
          <div className="date-field">
            <label htmlFor="check-in">CHECK-IN</label>
            <div className="input-wrapper">
              <Calendar size={16} />
              <input
                id="check-in"
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => handleCheckInChange(e.target.value)}
              />
            </div>
          </div>
          <div className="date-field">
            <label htmlFor="check-out">CHECK-OUT</label>
            <div className="input-wrapper">
              <Calendar size={16} />
              <input
                id="check-out"
                type="date"
                value={checkOut}
                min={getMinCheckOut()}
                onChange={(e) => handleCheckOutChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="guests-field">
          <label htmlFor="guests-select">GUESTS</label>
          <div className="input-wrapper">
            <Users size={16} />
            <select
              id="guests-select"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {Array.from({ length: stay.guests }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="booking-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button type="button" className="reserve-btn" onClick={handleReserve}>
          Reserve
        </button>

        <p className="charge-notice">You won't be charged yet</p>

        {nights > 0 && (
          <div className="price-breakdown">
            <div className="price-row">
              <span>
                ${stay.price} x {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
              <span>${subtotal}</span>
            </div>
            <div className="price-row">
              <span>Service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
