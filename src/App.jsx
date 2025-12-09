import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import Home from './pages/Home';
import StayDetails from './pages/StayDetails';
import Wishlist from './pages/Wishlist';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import './App.css';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stay/:id" element={<StayDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;
