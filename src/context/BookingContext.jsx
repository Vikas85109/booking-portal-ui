import { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookingHistory, setBookingHistory] = useState(() => {
    const saved = localStorage.getItem('bookingHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 600],
    rating: 0,
    location: 'All Locations',
    propertyType: 'All Types',
    guests: 1
  });

  const [bookingData, setBookingData] = useState({
    stay: null,
    checkIn: null,
    checkOut: null,
    guests: 1,
    totalPrice: 0
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
  }, [bookingHistory]);

  const addToWishlist = (stayId) => {
    setWishlist(prev => {
      if (prev.includes(stayId)) {
        return prev.filter(id => id !== stayId);
      }
      return [...prev, stayId];
    });
  };

  const isInWishlist = (stayId) => wishlist.includes(stayId);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 600],
      rating: 0,
      location: 'All Locations',
      propertyType: 'All Types',
      guests: 1
    });
  };

  const startBooking = (stay, checkIn, checkOut, guests) => {
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = stay.price * nights;
    setBookingData({
      stay,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      nights
    });
  };

  const clearBooking = () => {
    setBookingData({
      stay: null,
      checkIn: null,
      checkOut: null,
      guests: 1,
      totalPrice: 0
    });
  };

  const confirmBooking = (guestInfo) => {
    const confirmationNumber = 'BK' + Date.now().toString().slice(-8);
    const serviceFee = Math.round(bookingData.totalPrice * 0.12);

    const newBooking = {
      id: confirmationNumber,
      stay: bookingData.stay,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      nights: bookingData.nights,
      subtotal: bookingData.totalPrice,
      serviceFee,
      totalPaid: bookingData.totalPrice + serviceFee,
      guestInfo,
      bookedAt: new Date().toISOString(),
      status: 'confirmed'
    };

    setBookingHistory(prev => [newBooking, ...prev]);
    return confirmationNumber;
  };

  const cancelBooking = (bookingId) => {
    setBookingHistory(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      )
    );
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookingHistory.filter(booking =>
      booking.status === 'confirmed' && new Date(booking.checkIn) > now
    );
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookingHistory.filter(booking =>
      new Date(booking.checkOut) < now || booking.status === 'cancelled'
    );
  };

  return (
    <BookingContext.Provider
      value={{
        wishlist,
        addToWishlist,
        isInWishlist,
        searchQuery,
        setSearchQuery,
        filters,
        updateFilters,
        resetFilters,
        bookingData,
        startBooking,
        clearBooking,
        confirmBooking,
        cancelBooking,
        bookingHistory,
        getUpcomingBookings,
        getPastBookings
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
