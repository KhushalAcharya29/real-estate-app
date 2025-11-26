import { useGetInterestedClientsQuery } from "../../app/api";

interface InterestedClientsModalProps {
  propertyId: string;
  onClose: () => void;
}

interface ClientDetails {
  name: string;
  email: string;
}

interface ClientInterest {
  _id: string;
  clientId: ClientDetails;
  message?: string;
}

export default function InterestedClientsModal({
  propertyId,
  onClose,
}: InterestedClientsModalProps) {
  const { data, isLoading, isError } = useGetInterestedClientsQuery(propertyId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl flex flex-col items-center animate-pulse">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-2xl">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Unable to Load</h3>
          <p className="text-gray-500 mt-1 mb-6">We couldn't fetch the client list at this moment.</p>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-medium transition active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const clients = data?.data || [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl ring-1 ring-black/5">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Interested Clients</h2>
            <p className="text-sm text-gray-500 mt-0.5">{clients.length} potential leads</p>
          </div>
          
          {/* FIX: Added aria-label here */}
          <button
            onClick={onClose}
            aria-label="Close modal" 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 space-y-4">
          {clients.length === 0 && (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="text-gray-500">No interest expressed yet.</p>
            </div>
          )}

          {clients.map((interest: ClientInterest) => (
            <div
              key={interest._id}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {getInitials(interest.clientId.name)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {interest.clientId.name}
                  </h3>
                  <a 
                    href={`mailto:${interest.clientId.email}`} 
                    className="text-sm text-gray-500 hover:text-blue-600 truncate block transition-colors"
                  >
                    {interest.clientId.email}
                  </a>
                </div>
              </div>

              {interest.message && (
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic relative">
                  <span className="absolute -top-1.5 left-4 w-3 h-3 bg-gray-50 border-t border-l border-gray-100 transform rotate-45"></span>
                  “{interest.message}”
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium py-2.5 rounded-xl shadow-sm transition active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}