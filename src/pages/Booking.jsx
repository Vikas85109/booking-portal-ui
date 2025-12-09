import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  MapPin,
  Shield,
  Clock,
  AlertCircle,
  Star,
  Home,
  Sparkles,
  Lock,
  CheckCircle2,
  Gift,
  Info,
  ChevronRight,
  Building2,
  CalendarDays,
  BadgeCheck
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const { bookingData, clearBooking, confirmBooking } = useBooking();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    specialRequests: '',
    arrivalTime: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const { stay, checkIn, checkOut, guests, totalPrice, nights } = bookingData;

  if (!stay) {
    return (
      <div className="booking-page">
        <div className="no-booking">
          <div className="no-booking-icon">
            <Calendar size={48} />
          </div>
          <h2>No booking in progress</h2>
          <p>Please select a stay and dates to make a booking</p>
          <Link to="/" className="back-home-btn">
            <Home size={18} />
            Browse stays
          </Link>
        </div>
      </div>
    );
  }

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\D/g, '');
      const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
      setFormData((prev) => ({ ...prev, [name]: formatted.slice(0, 19) }));
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        setFormData((prev) => ({ ...prev, [name]: formatted }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: cleaned }));
      }
    }
    // CVV only numbers
    else if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    }
    // Phone formatting
    else if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 0) {
        if (cleaned.length <= 3) {
          formatted = `(${cleaned}`;
        } else if (cleaned.length <= 6) {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    const cardNum = formData.cardNumber.replace(/\s/g, '');
    if (!cardNum) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNum.length < 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Use MM/YY format';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry < new Date()) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const confNum = confirmBooking({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    });

    setConfirmationNumber(confNum);
    setIsSubmitting(false);
    setBookingComplete(true);
  };

  const serviceFee = Math.round(stay.price * nights * 0.12);
  const cleaningFee = 45;
  const finalTotal = totalPrice + serviceFee + cleaningFee;

  const getCardType = () => {
    const num = formData.cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    if (num.startsWith('3')) return 'amex';
    return null;
  };

  if (bookingComplete) {
    return (
      <div className="booking-page">
        <div className="booking-success">
          <div className="success-animation">
            <div className="success-icon">
              <CheckCircle2 size={56} />
            </div>
            <div className="success-confetti">
              <Sparkles size={24} />
            </div>
          </div>
          <h1>Booking Confirmed!</h1>
          <p className="success-subtitle">Your reservation has been successfully made</p>

          <div className="confirmation-card">
            <div className="confirmation-badge">
              <BadgeCheck size={20} />
              <span>Confirmation #{confirmationNumber}</span>
            </div>

            <div className="confirmation-stay">
              <img src={stay.images[0]} alt={stay.title} />
              <div className="confirmation-stay-info">
                <span className="stay-type-badge">{stay.type}</span>
                <h3>{stay.title}</h3>
                <p>
                  <MapPin size={14} />
                  {stay.location}
                </p>
                <div className="stay-rating-small">
                  <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                  <span>{stay.rating}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-dates">
              <div className="date-block">
                <span className="date-label">CHECK-IN</span>
                <span className="date-value">{formatDate(checkIn)}</span>
                <span className="date-time">From 3:00 PM</span>
              </div>
              <div className="date-divider">
                <CalendarDays size={20} />
                <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
              </div>
              <div className="date-block">
                <span className="date-label">CHECK-OUT</span>
                <span className="date-value">{formatDate(checkOut)}</span>
                <span className="date-time">Before 11:00 AM</span>
              </div>
            </div>

            <div className="confirmation-guest">
              <Users size={18} />
              <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
            </div>

            <div className="confirmation-payment">
              <div className="payment-row">
                <span>Total paid</span>
                <strong>${finalTotal}</strong>
              </div>
            </div>

            <div className="confirmation-email">
              <Mail size={16} />
              <span>Confirmation sent to <strong>{formData.email}</strong></span>
            </div>
          </div>

          <div className="success-tips">
            <h4>What's next?</h4>
            <div className="tip-item">
              <div className="tip-icon">
                <Info size={18} />
              </div>
              <div>
                <strong>Check your email</strong>
                <p>We've sent you all the details about your stay</p>
              </div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">
                <Gift size={18} />
              </div>
              <div>
                <strong>Review house rules</strong>
                <p>Make sure to check the property's guidelines</p>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/my-bookings" className="view-bookings-btn">
              View My Bookings
            </Link>
            <Link
              to="/"
              className="done-btn"
              onClick={() => clearBooking()}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-content">
            <h1>Complete your booking</h1>
            <p className="header-subtitle">
              {stay.title} - {nights} {nights === 1 ? 'night' : 'nights'}
            </p>
          </div>
        </div>

        <div className="booking-content">
          <div className="booking-form-section">
            {/* Progress Steps */}
            <div className="steps-indicator">
              <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > 1 ? <Check size={16} /> : <User size={16} />}
                </div>
                <div className="step-info">
                  <span className="step-title">Guest Details</span>
                  <span className="step-desc">Your information</span>
                </div>
              </div>
              <div className={`step-connector ${currentStep > 1 ? 'active' : ''}`} />
              <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-number">
                  {currentStep > 2 ? <Check size={16} /> : <CreditCard size={16} />}
                </div>
                <div className="step-info">
                  <span className="step-title">Payment</span>
                  <span className="step-desc">Secure checkout</span>
                </div>
              </div>
              <div className={`step-connector ${currentStep > 2 ? 'active' : ''}`} />
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">
                  <CheckCircle2 size={16} />
                </div>
                <div className="step-info">
                  <span className="step-title">Confirm</span>
                  <span className="step-desc">Review & book</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Guest Details */}
              {currentStep === 1 && (
                <div className="form-step">
                  <div className="step-header">
                    <h2>Guest Details</h2>
                    <p className="step-description">Please enter your contact information</p>
                  </div>

                  <div className="form-card">
                    <div className="form-section-title">
                      <User size={18} />
                      <span>Personal Information</span>
                    </div>

                    <div className="form-row">
                      <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <span className="error-message">
                            <AlertCircle size={14} />
                            {errors.firstName}
                          </span>
                        )}
                      </div>
                      <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <span className="error-message">
                            <AlertCircle size={14} />
                            {errors.lastName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-section-title">
                      <Mail size={18} />
                      <span>Contact Information</span>
                    </div>

                    <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                      />
                      <span className="input-hint">Booking confirmation will be sent here</span>
                      {errors.email && (
                        <span className="error-message">
                          <AlertCircle size={14} />
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 000-0000"
                      />
                      {errors.phone && (
                        <span className="error-message">
                          <AlertCircle size={14} />
                          {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-card">
                    <div className="form-section-title">
                      <Clock size={18} />
                      <span>Trip Details</span>
                    </div>

                    <div className="form-group">
                      <label>Estimated Arrival Time (optional)</label>
                      <select
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                      >
                        <option value="">Select time</option>
                        <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                        <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
                        <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
                        <option value="6:00 PM - 7:00 PM">6:00 PM - 7:00 PM</option>
                        <option value="7:00 PM - 8:00 PM">7:00 PM - 8:00 PM</option>
                        <option value="8:00 PM - 9:00 PM">8:00 PM - 9:00 PM</option>
                        <option value="After 9:00 PM">After 9:00 PM</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Special Requests (optional)</label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requirements, accessibility needs, or requests..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <button type="button" className="next-btn" onClick={handleNextStep}>
                    Continue to Payment
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="form-step">
                  <div className="step-header">
                    <h2>Payment Details</h2>
                    <p className="step-description">Enter your card information securely</p>
                  </div>

                  <div className="secure-badge">
                    <Lock size={16} />
                    <div>
                      <strong>Secure Payment</strong>
                      <span>Your payment information is encrypted and secure</span>
                    </div>
                    <Shield size={24} />
                  </div>

                  <div className="form-card">
                    <div className="form-section-title">
                      <CreditCard size={18} />
                      <span>Card Information</span>
                      <div className="card-logos">
                        <div className={`card-logo visa ${getCardType() === 'visa' ? 'active' : ''}`}>VISA</div>
                        <div className={`card-logo mastercard ${getCardType() === 'mastercard' ? 'active' : ''}`}>MC</div>
                        <div className={`card-logo amex ${getCardType() === 'amex' ? 'active' : ''}`}>AMEX</div>
                      </div>
                    </div>

                    <div className={`form-group ${errors.cardNumber ? 'has-error' : ''}`}>
                      <label>Card Number</label>
                      <div className="card-input-wrapper">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {getCardType() && (
                          <span className={`card-type-badge ${getCardType()}`}>
                            {getCardType().toUpperCase()}
                          </span>
                        )}
                      </div>
                      {errors.cardNumber && (
                        <span className="error-message">
                          <AlertCircle size={14} />
                          {errors.cardNumber}
                        </span>
                      )}
                    </div>

                    <div className={`form-group ${errors.cardName ? 'has-error' : ''}`}>
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="JOHN DOE"
                        style={{ textTransform: 'uppercase' }}
                      />
                      {errors.cardName && (
                        <span className="error-message">
                          <AlertCircle size={14} />
                          {errors.cardName}
                        </span>
                      )}
                    </div>

                    <div className="form-row">
                      <div className={`form-group ${errors.expiryDate ? 'has-error' : ''}`}>
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <span className="error-message">
                            <AlertCircle size={14} />
                            {errors.expiryDate}
                          </span>
                        )}
                      </div>
                      <div className={`form-group ${errors.cvv ? 'has-error' : ''}`}>
                        <label>
                          CVV
                          <span className="cvv-info" title="3 or 4 digit security code on the back of your card">
                            <Info size={14} />
                          </span>
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="***"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <span className="error-message">
                            <AlertCircle size={14} />
                            {errors.cvv}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="payment-info-box">
                    <Info size={18} />
                    <p>You will be charged <strong>${finalTotal}</strong> upon confirmation. Free cancellation available for 48 hours.</p>
                  </div>

                  <div className="form-buttons">
                    <button type="button" className="prev-btn" onClick={handlePrevStep}>
                      <ArrowLeft size={18} />
                      Back
                    </button>
                    <button type="button" className="next-btn" onClick={handleNextStep}>
                      Review Booking
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <div className="form-step">
                  <div className="step-header">
                    <h2>Review & Confirm</h2>
                    <p className="step-description">Please verify all details before confirming</p>
                  </div>

                  <div className="review-card">
                    <div className="review-section">
                      <h3>
                        <User size={18} />
                        Guest Information
                      </h3>
                      <div className="review-grid">
                        <div className="review-item">
                          <span>Full Name</span>
                          <strong>{formData.firstName} {formData.lastName}</strong>
                        </div>
                        <div className="review-item">
                          <span>Email</span>
                          <strong>{formData.email}</strong>
                        </div>
                        <div className="review-item">
                          <span>Phone</span>
                          <strong>{formData.phone}</strong>
                        </div>
                        {formData.arrivalTime && (
                          <div className="review-item">
                            <span>Arrival Time</span>
                            <strong>{formData.arrivalTime}</strong>
                          </div>
                        )}
                      </div>
                      <button type="button" className="edit-btn" onClick={() => setCurrentStep(1)}>
                        Edit
                      </button>
                    </div>

                    <div className="review-section">
                      <h3>
                        <CreditCard size={18} />
                        Payment Method
                      </h3>
                      <div className="review-grid">
                        <div className="review-item card-preview">
                          <div className={`card-icon ${getCardType()}`}>
                            {getCardType()?.toUpperCase() || 'CARD'}
                          </div>
                          <div>
                            <span>Card ending in</span>
                            <strong>**** {formData.cardNumber.slice(-4)}</strong>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="edit-btn" onClick={() => setCurrentStep(2)}>
                        Edit
                      </button>
                    </div>

                    <div className="review-section">
                      <h3>
                        <Calendar size={18} />
                        Trip Details
                      </h3>
                      <div className="review-dates">
                        <div className="review-date">
                          <span>Check-in</span>
                          <strong>{formatDate(checkIn)}</strong>
                          <span className="time">From 3:00 PM</span>
                        </div>
                        <div className="review-nights">
                          <span>{nights}</span>
                          <span>{nights === 1 ? 'night' : 'nights'}</span>
                        </div>
                        <div className="review-date">
                          <span>Check-out</span>
                          <strong>{formatDate(checkOut)}</strong>
                          <span className="time">Before 11:00 AM</span>
                        </div>
                      </div>
                      <div className="review-item guests">
                        <Users size={16} />
                        <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="policy-section">
                    <div className="cancellation-policy">
                      <Clock size={20} />
                      <div>
                        <strong>Free cancellation for 48 hours</strong>
                        <p>After that, cancel before check-in and get a 50% refund, minus the service fee.</p>
                      </div>
                    </div>

                    <div className="house-rules">
                      <Building2 size={20} />
                      <div>
                        <strong>House rules</strong>
                        <p>No smoking, no parties, check-in after 3 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="terms-checkbox">
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms">
                      I agree to the <a href="#terms">Terms of Service</a>, <a href="#privacy">Privacy Policy</a>, and the host's <a href="#rules">House Rules</a>
                    </label>
                  </div>

                  <div className="form-buttons">
                    <button type="button" className="prev-btn" onClick={handlePrevStep}>
                      <ArrowLeft size={18} />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          Confirm & Pay ${finalTotal}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="booking-summary">
            <div className="summary-card">
              <div className="summary-header">
                <img src={stay.images[0]} alt={stay.title} />
                <div>
                  <span className="stay-type">{stay.type}</span>
                  <h3>{stay.title}</h3>
                  <p className="stay-location">
                    <MapPin size={14} />
                    {stay.location}
                  </p>
                  <div className="stay-rating">
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{stay.rating}</span>
                    <span className="reviews">({stay.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="summary-divider" />

              <div className="summary-details">
                <h4>Your trip</h4>
                <div className="trip-dates">
                  <div className="trip-date">
                    <Calendar size={16} />
                    <div>
                      <span>Check-in</span>
                      <strong>{formatShortDate(checkIn)}</strong>
                    </div>
                  </div>
                  <div className="trip-arrow">
                    <ChevronRight size={16} />
                  </div>
                  <div className="trip-date">
                    <Calendar size={16} />
                    <div>
                      <span>Check-out</span>
                      <strong>{formatShortDate(checkOut)}</strong>
                    </div>
                  </div>
                </div>
                <div className="trip-info">
                  <div className="info-item">
                    <Users size={16} />
                    <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                  </div>
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                  </div>
                </div>
              </div>

              <div className="summary-divider" />

              <div className="price-details">
                <h4>Price details</h4>
                <div className="price-row">
                  <span>${stay.price} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="price-row">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="price-row">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="price-row total">
                  <span>Total (USD)</span>
                  <span>${finalTotal}</span>
                </div>
              </div>

              <div className="price-guarantee">
                <Shield size={16} />
                <span>Your payment is protected by our secure booking guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
