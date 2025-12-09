import { MapPin, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { useState } from 'react';
import './MapSection.css';

const MapSection = ({ location, coordinates }) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));

  return (
    <div className="map-section">
      <h3 className="map-title">
        <MapPin size={20} />
        Where you'll be
      </h3>
      <p className="map-location">{location}</p>

      <div className="map-container">
        <div
          className="map-mock"
          style={{
            transform: `scale(${zoom})`,
            backgroundSize: `${400 / zoom}px ${400 / zoom}px`
          }}
        >
          <div className="map-marker">
            <div className="marker-pin">
              <MapPin size={24} fill="#2563eb" />
            </div>
            <div className="marker-pulse" />
          </div>

          {/* Mock map elements */}
          <div className="map-roads">
            <div className="road road-h-1" />
            <div className="road road-h-2" />
            <div className="road road-v-1" />
            <div className="road road-v-2" />
            <div className="road road-diagonal" />
          </div>

          <div className="map-labels">
            <span className="map-label label-1">Main St</span>
            <span className="map-label label-2">Park Ave</span>
            <span className="map-label label-3">Beach Rd</span>
          </div>

          <div className="map-areas">
            <div className="area area-park" title="Central Park" />
            <div className="area area-water" title="Lake" />
          </div>
        </div>

        <div className="map-controls">
          <button className="map-control-btn" onClick={handleZoomIn}>
            <ZoomIn size={18} />
          </button>
          <button className="map-control-btn" onClick={handleZoomOut}>
            <ZoomOut size={18} />
          </button>
          <button className="map-control-btn">
            <Navigation size={18} />
          </button>
        </div>

        <div className="map-coordinates">
          {coordinates.lat.toFixed(4)}°N, {Math.abs(coordinates.lng).toFixed(4)}°W
        </div>
      </div>

      <div className="map-info">
        <p>
          Exact location provided after booking. This property is in a quiet
          residential area with easy access to local attractions.
        </p>
      </div>
    </div>
  );
};

export default MapSection;
