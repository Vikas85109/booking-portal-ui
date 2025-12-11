# StayBooker - Accommodation Booking Portal

A modern, fully-responsive accommodation booking portal built with React. Browse, search, and book vacation rentals with a seamless user experience.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![React Router](https://img.shields.io/badge/React_Router-7.10.1-CA4245?logo=reactrouter)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Property Listings** - Browse accommodations with grid layout and detailed cards
- **Search & Filter** - Find properties by location, price, rating, property type, and guest count
- **Property Details** - View comprehensive information, image galleries, amenities, and maps
- **Booking Flow** - Multi-step booking with form validation and price calculation
- **Booking Management** - View, track, and cancel bookings
- **Wishlist** - Save favorite properties for later
- **Responsive Design** - Optimized for mobile, tablet, and desktop

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Routing | React Router DOM 7 |
| Build Tool | Vite 7 |
| Icons | Lucide React |
| Styling | CSS3 (BEM methodology) |
| State Management | React Context API |

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Vikas85109/booking-portal-ui.git

# Navigate to project directory
cd booking-portal-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookingCard/     # Booking widget
│   ├── Filters/         # Filter sidebar
│   ├── Header/          # Navigation header
│   ├── ImageGallery/    # Modal image gallery
│   ├── MapSection/      # Map visualization
│   ├── SearchBar/       # Search form
│   ├── StayCard/        # Property card
│   └── StayList/        # Property grid
├── context/
│   └── BookingContext.jsx  # Global state
├── data/
│   └── stays.js         # Mock data
├── pages/
│   ├── Booking/         # Booking flow
│   ├── Home/            # Main listing page
│   ├── MyBookings/      # Booking history
│   ├── StayDetails/     # Property details
│   └── Wishlist/        # Saved properties
├── App.jsx              # Root component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Property listings with search/filter |
| `/stay/:id` | StayDetails | Individual property page |
| `/booking` | Booking | Multi-step booking form |
| `/my-bookings` | MyBookings | Booking history & management |
| `/wishlist` | Wishlist | Saved properties |

## Key Features Explained

### Search & Filtering
- Real-time search by location, title, or property type
- Filter by price range, minimum rating, location, property type, and guest count
- Filters persist across navigation

### Booking Flow
1. **Guest Details** - Name, email, phone, arrival time, special requests
2. **Payment** - Card details with input masking
3. **Review & Confirm** - Summary and confirmation

### Price Calculation
- Base price × number of nights
- Service fee: 12% of subtotal
- Cleaning fee: $45 (fixed)

### Data Persistence
- Wishlist saved to localStorage
- Booking history persisted across sessions

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Deploy automatically

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

### Manual Deployment
```bash
npm run build
# Deploy contents of /dist folder
```

## Documentation

For detailed documentation, open `PROJECT_DOCUMENTATION.html` in a browser and print to PDF.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Vikas** - [GitHub](https://github.com/Vikas85109)

---

Built with React + Vite
