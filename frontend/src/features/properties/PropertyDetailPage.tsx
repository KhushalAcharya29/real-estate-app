import { useParams, Link } from "react-router-dom";
import { useGetPropertyQuery, useExpressInterestMutation } from "../../app/api";
import { useState } from "react";
// import MortgageCalculator from "../../components/MortgageCalculator";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Leaflet Icon Fix ---
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface ApiError {
  data?: {
    message?: string;
  };
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetPropertyQuery(id || "", { skip: !id });
  const [expressInterest, { isLoading: isSubmitting }] = useExpressInterestMutation();
  
  // State for View Mode (Photos vs Map)
  const [viewMode, setViewMode] = useState<'photos' | 'map'>('photos');
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading details...</p>
      </div>
    );
  }

  const property = data?.data;

  if (!property) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900">Property Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">The property you are looking for does not exist or has been removed.</p>
        <Link to="/" className="text-blue-600 hover:underline font-medium">Back to Listings</Link>
      </div>
    );
  }

  // Map Coordinates (Fallback to Mumbai if missing)
  const lat = Number(property.location?.lat) || 19.076;
  const lng = Number(property.location?.lng) || 72.8777;

  const handleInterest = async () => {
    setError("");
    setSuccess("");
    try {
      await expressInterest({ propertyId: property._id, message }).unwrap();
      setSuccess("Interest submitted! The agent will contact you shortly.");
      setMessage("");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back to Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: Media & Details --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* View Toggles */}
          <div className="flex items-center gap-4 border-b border-gray-200">
            <button
              onClick={() => setViewMode('photos')}
              className={`pb-3 text-sm font-semibold transition-all ${
                viewMode === 'photos' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`pb-3 text-sm font-semibold transition-all ${
                viewMode === 'map' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Map View
            </button>
          </div>

          {/* Main Media Area (Image or Map) */}
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm bg-gray-100 relative">
            {viewMode === 'photos' ? (
              <img
                src={property.images?.[0] || "https://via.placeholder.com/800x600?text=No+Image"}
                alt={property.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <MapContainer
                center={[lat, lng]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} icon={customIcon}>
                  <Popup className="font-semibold">{property.title}</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>

          {/* Info Header */}
          <div>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">
                    {property.location?.address ? `${property.location.address}, ` : ""} 
                    {property.location?.city || "Unknown Location"}
                  </span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-3xl font-bold text-blue-600">
                  ₹{property.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">Guide Price</p>
              </div>
            </div>
          </div>

          {/* Features Bar */}
          <div className="flex items-center gap-8 py-6 border-y border-gray-100 overflow-x-auto">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">🛏️</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Bedrooms</p>
                <p className="text-lg font-bold text-gray-900">{property.bedrooms || "-"}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">🚿</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Bathrooms</p>
                <p className="text-lg font-bold text-gray-900">{property.bathrooms || "-"}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">📐</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Area</p>
                <p className="text-lg font-bold text-gray-900">{property.areaSqFt ? `${property.areaSqFt} sq ft` : "-"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">About this property</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description || "No description provided."}
            </p>
          </div>

          {/* Signature Feature: Mortgage Calculator */}
          {/* <MortgageCalculator price={property.price} /> */}

        </div>

        {/* --- RIGHT COLUMN: Sticky Contact Form --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Interested?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Send a message to the agent to book a viewing or ask questions.
            </p>

            {success && (
              <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm border border-green-100 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I am interested in this property..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              <button
                onClick={handleInterest}
                disabled={isSubmitting || !!success}
                className={`w-full font-semibold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] flex justify-center items-center gap-2
                  ${success 
                    ? "bg-green-600 text-white cursor-default shadow-none" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 hover:shadow-lg"
                  }
                  ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}
                `}
              >
                {isSubmitting ? "Sending..." : success ? "Message Sent" : "Send Message"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}