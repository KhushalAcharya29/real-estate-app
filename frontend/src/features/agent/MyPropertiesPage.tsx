import { useState } from "react";
import { useMyPropertiesQuery } from "../../app/api";
import type { Property } from "../../app/api"; 
import PropertyForm from "./PropertyForm";
import InterestedClientsModal from "./InterestedClientsModal";

export default function MyPropertiesPage() {
  const { data, isLoading, refetch } = useMyPropertiesQuery();
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // --- Professional Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading your portfolio...</p>
      </div>
    );
  }

  const properties = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* --- Top Section: Add Property --- */}
      <section>
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Property Portfolio
          </h1>
          <p className="text-gray-500 mt-1">
            Add new listings and manage your active properties.
          </p>
        </div>
        
        {/* Form Container */}
        <div className="mt-6">
          <PropertyForm onCreated={refetch} />
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* --- Bottom Section: Property Grid --- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Active Listings
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {properties.length}
            </span>
          </h2>
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No properties listed yet</h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
              Use the form above to create your first listing and start attracting clients.
            </p>
          </div>
        )}

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop: Property) => (
            <div 
              key={prop._id} 
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image with Zoom Effect */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={prop.images?.[0] || "https://via.placeholder.com/600x400?text=No+Image"}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  alt={prop.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                  <p className="text-blue-700 font-bold text-sm">
                    ₹{prop.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                    {prop.title}
                  </h3>
                  
                  <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-0.5 text-gray-400 shrink-0">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span className="line-clamp-2 leading-relaxed">
                      {prop.location?.city || "Unknown Location"}
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  onClick={() => setSelectedProperty(prop._id)}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  Interested Clients
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Overlay */}
      {selectedProperty && (
        <InterestedClientsModal
          propertyId={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}