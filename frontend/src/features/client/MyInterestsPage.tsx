import { Link } from "react-router-dom";
import { useMyInterestsQuery } from "../../app/api";

// 1. Define the shape of the Property inside the interest
interface PropertyDetails {
  title: string;
  price: number;
  location?: {
    city?: string;
  };
  images?: string[];
  _id?: string; // Ideally your API returns the nested ID here too
}

// 2. Define the shape of the Interest item itself
interface InterestItem {
  _id: string;
  propertyId: PropertyDetails; 
}

export default function MyInterestsPage() {
  const { data, isLoading } = useMyInterestsQuery();

  // --- Professional Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading your wishlist...</p>
      </div>
    );
  }

  const interests = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Section */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Saved Properties
        </h1>
        <p className="text-gray-500 mt-1">
          Properties you have expressed interest in.
        </p>
      </div>

      {/* --- Empty State --- */}
      {interests.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No saved properties yet</h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto mb-6">
            Start exploring and click "I'm Interested" on properties you like to save them here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {/* --- Grid Layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {interests.map((item: InterestItem) => (
          <div 
            key={item._id} 
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
          >
            
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={item.propertyId.images?.[0] || "https://via.placeholder.com/600x400?text=No+Image"}
                alt={item.propertyId.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-800 px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <span className="text-red-500">❤️</span> Interested
              </div>

              {/* Price Tag Overlay */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                <p className="text-blue-700 font-bold text-sm">
                  ₹{item.propertyId.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.propertyId.title}
                </h3>
                
                <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-0.5 text-gray-400 shrink-0">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span className="line-clamp-1">
                    {item.propertyId.location?.city || 'Unknown Location'}
                  </span>
                </div>
              </div>

              {/* Footer Action */}
              {/* Note: We assume _id is inside the interest object. If you need the property's ID specifically for the link, ensure your API populates it. */}
              <Link
                 to={`/property/${item.propertyId._id || item._id}`} // Fallback logic depending on API structure
                 className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                View Property Details
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}