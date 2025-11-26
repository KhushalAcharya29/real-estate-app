import { useEffect, useState } from "react";
import { useListPropertiesQuery } from "../../app/api";
import type { Property } from "../../app/api";
import PropertyCard from "./PropertyCard";
import { motion, type Variants } from "framer-motion";
import { toast } from "react-hot-toast";

// --- Skeleton Component ---
const CardSkeleton = () => (
  <div className="min-w-[320px] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
    <div className="h-56 bg-gray-200 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      <div className="h-10 bg-gray-200 rounded w-full mt-4 animate-pulse" />
    </div>
  </div>
);

// --- Service Data ---
const services = [
  {
    id: 1,
    title: "Agents / Brokers",
    desc: "Here Are Hassle-Free Solutions! Buy - Sell - Rent Your Property.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Builders / Developers",
    desc: "List of the most trusted and reliable builders to fulfill your Dream HOME.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Architects",
    desc: "Professional Architecture will meet your needs and expectations.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Interior Decorators",
    desc: "A One-Stop Solution for all your decor Needs to Match Your Lifestyle.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-pink-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Vaastu Consultant",
    desc: "Connect to top most Vastu consultants for right direction.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    id: 6,
    title: "Building Contractors",
    desc: "General contractor for a home repair, remodel, or construction.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.703-.127 1.543.174 2.099.55 2.099.55s.305-1.855-1.065-2.795c-1.37-.939-2.793-1.043-2.793-1.043s-.175 1.451-1.94 3.414" />
      </svg>
    ),
  },
  {
    id: 7,
    title: "Home Inspection",
    desc: "A complete range of building and home inspection services.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-teal-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    id: 8,
    title: "Property Consultants",
    desc: "List of Leading Real Estate Consultant for Professional Assistance.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

// --- Overview Data ---
const overviewStats = [
  { value: "3660+", label: "Ready to Move Flats" },
  { value: "30+", label: "Ready to Move House" },
  { value: "6636+", label: "Property for Rent" },
  { value: "1158+", label: "Residential Projects" },
];

// --- Footer Links Data ---
const footerLinks = [
  "Home", "About Us", "Contact Us", "Feedback", "Complaints", 
  "Terms & Conditions", "Testimonials", "Sitemap", "Property Leads", 
  "FAQ", "Advertise With Us", "Live Coverage"
];

export default function PropertyListPage() {
  // ---- State ----
  const [cityName, setCityName] = useState<string>("Navi Mumbai");
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  // UI States for Tabs
  const saleTabs = ["Most Popular", "By Budget", "By Type", "By BHK"] as const;
  const rentTabs = ["Most Popular", "By Budget", "By Type", "By BHK"] as const;
  const [activeSaleTab, setActiveSaleTab] = useState<string>("Most Popular");
  const [activeRentTab, setActiveRentTab] = useState<string>("Most Popular");

  // ---- Fetch properties ----
  const { data, isLoading, isFetching } = useListPropertiesQuery(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""))
  );
  
  const properties: Property[] = data?.data || [];
  
  const saleProperties = properties.slice(0, Math.ceil(properties.length / 2));
  const rentProperties = properties.slice(Math.ceil(properties.length / 2));
  
  const isPageLoading = isLoading || isFetching;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const clearFilters = () =>
    setFilters({ city: "", minPrice: "", maxPrice: "", bedrooms: "" });

  // ---- Detect user's location ----
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoaded(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const detectedCity =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            "Navi Mumbai";
          setCityName(detectedCity);
        } catch {
          // Silent fail fallback
        } finally {
          setLocationLoaded(true);
        }
      },
      () => {
        setCityName("Navi Mumbai");
        setLocationLoaded(true);
      }
    );
  }, []);

  const handleReadMore = () => {
    toast("Will be available soon!", {
        icon: "🚧",
        style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
        },
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 15 }
    },
  };

  const inputClass = "w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-sm";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
  const tabBase = "px-4 py-2 rounded-full text-sm font-medium transition-all border";
  const tabActive = "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105";
  const tabIdle = "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300";

  // --- Social Media Data with Icons ---
const socialLinks = [
  { 
    name: "facebook", 
    color: "hover:text-blue-600",
    path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
  },
  { 
    name: "twitter", 
    color: "hover:text-sky-500",
    path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
  },
  { 
    name: "linkedin", 
    color: "hover:text-blue-700",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"
  },
  { 
    name: "instagram", 
    color: "hover:text-pink-600",
    path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M19.07 3.68A9 9 0 0 0 3.68 19.07 9 9 0 0 0 19.07 3.68z" // Simplified camera icon style
  },
  { 
    name: "youtube", 
    color: "hover:text-red-600",
    path: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33zM9.75 15.02l5.75-3.27-5.75-3.27v6.54z"
  }
];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <span className="bg-blue-100 p-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm font-bold uppercase tracking-wide">
              {locationLoaded ? cityName : "Locating..."}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Home</span>
          </h1>
        </motion.div>
      </div>

      {/* --- Filter Dashboard --- */}
      <div className="top-20 z-30 bg-white/80 backdrop-blur-lg p-1 rounded-2xl shadow-sm border border-gray-200/50">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
                <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
              </svg>
              Filters
            </h2>
            {(filters.city || filters.minPrice || filters.maxPrice || filters.bedrooms) && (
              <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors">
                Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filters Inputs */}
            <div>
              <label className={labelClass}>Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input type="text" name="city" aria-label="Filter by City" value={filters.city} onChange={handleChange} placeholder="City (e.g. Mumbai)" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Min Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-bold text-xs">₹</span>
                <input type="number" name="minPrice" aria-label="Minimum Price" value={filters.minPrice} onChange={handleChange} placeholder="0" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Max Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-bold text-xs">₹</span>
                <input type="number" name="maxPrice" aria-label="Maximum Price" value={filters.maxPrice} onChange={handleChange} placeholder="Any" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Bedrooms</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <input type="number" name="bedrooms" aria-label="Filter by Bedrooms" value={filters.bedrooms} onChange={handleChange} placeholder="BHK" className={inputClass} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Content Sections --- */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            🏡 For Sale in <span className="text-blue-600">{cityName}</span>
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {saleTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveSaleTab(tab)} className={`${tabBase} ${activeSaleTab === tab ? tabActive : tabIdle}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="relative min-h-[300px]">
          {isPageLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : saleProperties.length > 0 ? (
            <motion.div key="sale-list" variants={containerVariants} initial="hidden" animate="show" className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scroll-smooth">
              {saleProperties.map((prop) => (
                <motion.div key={prop._id} variants={cardVariants} className="min-w-[320px] md:min-w-[350px] flex-shrink-0 snap-center">
                  <PropertyCard property={prop} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No sale properties found matching your filters.</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            🏢 For Rent in <span className="text-blue-600">{cityName}</span>
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {rentTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveRentTab(tab)} className={`${tabBase} ${activeRentTab === tab ? tabActive : tabIdle}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="relative min-h-[300px]">
          {isPageLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : rentProperties.length > 0 ? (
            <motion.div key="rent-list" variants={containerVariants} initial="hidden" animate="show" className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scroll-smooth">
              {rentProperties.map((prop) => (
                <motion.div key={prop._id} variants={cardVariants} className="min-w-[320px] md:min-w-[350px] flex-shrink-0 snap-center">
                  <PropertyCard property={prop} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No rental properties found matching your filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- Services Section --- */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
          Real Estate Services in <span className="text-blue-600">{cityName}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <motion.div key={service.id} whileHover={{ translateY: -5 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative group">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">{service.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">{service.desc}</p>
              <button onClick={handleReadMore} className="text-blue-600 font-semibold text-sm border border-blue-600 rounded-lg py-2 px-4 hover:bg-blue-600 hover:text-white transition-colors w-fit">Read More</button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- All Results --- */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Available Properties</h2>
        {isPageLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : properties.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <motion.div key={prop._id} variants={cardVariants}>
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No properties match your search</h3>
            <p className="text-gray-500 mt-1 mb-4">Try adjusting your filters to find what you're looking for.</p>
            <button onClick={clearFilters} className="text-blue-600 font-semibold hover:underline">Clear all filters</button>
          </div>
        )}
      </section>

      {/* --- Market Overview --- */}
      <section className="bg-gray-50 p-8 rounded-3xl border border-gray-200 text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">An Overview of the {cityName} Real Estate Market</h2>
        <div className="max-w-4xl mx-auto">
          <p className={`text-gray-600 leading-relaxed mb-4 transition-all duration-500 ${isOverviewExpanded ? '' : 'line-clamp-3'}`}>
            Modeled out in 1971 to be the new urban township of Mumbai, {cityName} is today one of the fastest developing cities in the country. The sands of time have turned {cityName} into one of the most attractive locations for people interested in residing near Mumbai. You can find a number of educational institutes, medical healthcare facilities, and seamless connectivity & transportation services in this well-planned city. Today, {cityName} is becoming the New Jersey of Mumbai, owing to its massive infrastructure developments.
          </p>
          <button onClick={() => setIsOverviewExpanded(!isOverviewExpanded)} className="text-blue-600 font-medium hover:underline mb-10 inline-flex items-center gap-1">
            {isOverviewExpanded ? "Read Less" : "Read More"}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform ${isOverviewExpanded ? 'rotate-180' : ''}`}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
          </button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-gray-200">
            {overviewStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</span>
                <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                <span className="text-xs text-gray-400">in {cityName}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10 text-center md:text-left">
            {footerLinks.map((link) => (
              <a 
                key={link} 
                href="#" 
                className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* App Store & Socials Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-gray-100">
            
            {/* App Stores */}
            <div className="flex gap-4">
              <button className="transform hover:scale-105 transition-transform">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-10"
                />
              </button>
              <button className="transform hover:scale-105 transition-transform">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on the App Store" 
                  className="h-10"
                />
              </button>
            </div>

            {/* Social Icons - FIXED */}
            <div className="flex gap-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href="#" 
                  className={`text-gray-400 transition-colors ${social.color}`}
                  aria-label={`Follow us on ${social.name}`}
                >
                  <svg 
                    className="w-6 h-6 fill-current" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-400 mt-4">
            <p>© 2025 RealEstatePro. All rights reserved. - Terms & Conditions</p>
            <p className="mt-2 max-w-3xl mx-auto leading-relaxed opacity-70">
              Note: Being an Intermediary, the role of RealEstatePro is limited to provide an online platform...
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}