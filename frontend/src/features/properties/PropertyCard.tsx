import { Link } from "react-router-dom";
// 1. IMPORT the shared type instead of defining it locally. 
// This fixes the "Type mismatch" errors you saw earlier.
import type { Property } from "../../app/api";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to={`/property/${property._id}`}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* --- Image Section --- */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images?.[0] || "https://via.placeholder.com/600x400?text=No+Image"}
          alt={property.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
          <p className="text-blue-700 font-bold text-sm">
            ₹{property.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>

        {/* Location with Icon */}
        <div className="flex items-start gap-1.5 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-0.5 text-gray-400 shrink-0">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-500 line-clamp-1">
            {property.location?.city || "Unknown city"}
          </p>
        </div>

        {/* Button (Pushed to bottom using mt-auto) */}
        <div className="mt-auto pt-4 border-t border-gray-50">
          <span className="flex items-center justify-center gap-2 w-full bg-gray-50 group-hover:bg-blue-600 text-gray-700 group-hover:text-white font-semibold py-2.5 rounded-xl transition-all duration-200">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}