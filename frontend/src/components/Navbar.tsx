import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGetMeQuery, api } from "../app/api";

// FIX 1: Import hooks from 'react-redux'
import { useDispatch, useSelector } from "react-redux"; 

// FIX 2: Use 'import type' for RootState
import type { RootState } from "../app/store"; 

import { logout, setUser } from "../features/auth/authSlice";
import { toast } from "react-hot-toast";

// --- NavLink Component ---
const NavLink = ({ 
  to, 
  label, 
  mobile = false, 
  onClick 
}: { 
  to: string; 
  label: string; 
  mobile?: boolean;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClasses = mobile
    ? "block w-full px-4 py-3 text-base font-medium rounded-xl transition-all duration-200"
    : "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200";

  const activeClasses = isActive
    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50";

  return (
    <Link to={to} onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
      {label}
    </Link>
  );
};

export default function Navbar() {
  const { data, isSuccess } = useGetMeQuery(undefined, { refetchOnMountOrArgChange: true });
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(setUser(data.user));
    }
  }, [isSuccess, data, dispatch]);

  const user = reduxUser;

  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout API failed:", err);
    }

    dispatch(logout());
    dispatch(api.util.resetApiState());
    setShowLogoutConfirm(false);
    navigate("/login", { replace: true });
  };

  const handleGuestClick = () => {
    toast("Please log in or register to explore more features!", {
      icon: "🔒",
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "G";
  const firstName = user?.name ? user.name.split(" ")[0] : "Guest";

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* --- Left Side: Logo --- */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2 rounded-xl shadow-blue-200 shadow-lg group-hover:shadow-blue-300 group-hover:scale-105 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  RealEstate<span className="text-blue-600">Pro</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1 ml-4">
                <NavLink to="/" label="Home" />
                {user?.role === "client" && <NavLink to="/my-interests" label="My Interests" />}
                {user?.role === "agent" && <NavLink to="/my-properties" label="My Properties" />}
              </div>
            </div>

            {/* --- Right Side: Auth & Mobile Toggle --- */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* User Profile / Guest Pill */}
              {!user ? (
                <div className="relative flex items-center gap-2">
                  
                  {/* --- Continuous Pop-up Tooltip (Desktop) --- */}
                  <div className="absolute top-full right-0 mt-5 w-max max-w-[220px] z-50 hidden md:block pointer-events-none">
                    <div className="relative bg-gray-900 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xl animate-bounce">
                      {/* Triangle Arrow pointing up */}
                      <div className="absolute -top-1 right-8 w-2.5 h-2.5 bg-gray-900 rotate-45"></div>
                      Register/login to access RealEstatePro free*
                    </div>
                  </div>

                  {/* Guest Pill */}
                  <button onClick={handleGuestClick} className="flex items-center gap-2 bg-gray-50 px-2 py-1.5 sm:px-3 rounded-full border border-gray-100 hover:bg-gray-100 transition">
                    <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">G</div>
                    <span className="text-sm font-bold text-gray-700 pr-1 hidden xs:block">Guest</span>
                  </button>
                  
                  {/* Compact Buttons for Mobile */}
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm px-2 py-2 hidden xs:block">Log in</Link>
                  <Link to="/register" className="bg-gray-900 hover:bg-black text-white px-3 py-2 sm:px-4 rounded-xl text-sm font-semibold shadow-lg transition active:scale-95">Get Started</Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Profile Pill */}
                  <div className="flex items-center gap-2 bg-gray-50 pl-1 pr-3 py-1 rounded-full border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
                      {initial}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-none mb-0.5 hidden sm:block">Welcome</p>
                      <p className="text-sm font-bold text-gray-900 leading-none">{firstName}</p>
                    </div>
                  </div>

                  {/* Logout Button (Desktop) */}
                  <button onClick={handleLogoutClick} className="hidden md:flex bg-white p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all active:scale-95 shadow-sm" title="Sign Out">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition active:scale-95"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- Mobile Menu Dropdown --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top-5 duration-200 shadow-lg absolute w-full left-0 top-16 z-30">
            <div className="px-4 py-4 space-y-2">
              
              {/* Mobile Tooltip Banner */}
              {!user && (
                <div className="bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-xl mb-4 shadow-md flex items-center gap-2 animate-pulse">
                  <span>💡</span>
                  Register/login to access RealEstatePro free*
                </div>
              )}

              <NavLink to="/" label="Home" mobile onClick={() => setIsMobileMenuOpen(false)} />
              {user?.role === "client" && <NavLink to="/my-interests" label="My Interests" mobile onClick={() => setIsMobileMenuOpen(false)} />}
              {user?.role === "agent" && <NavLink to="/my-properties" label="My Properties" mobile onClick={() => setIsMobileMenuOpen(false)} />}
              
              {user ? (
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <button 
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                   <Link to="/login" className="block w-full text-center text-gray-600 font-medium py-2 rounded-xl hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                   <Link to="/register" className="block w-full text-center bg-blue-600 text-white font-medium py-2 rounded-xl shadow-md hover:bg-blue-700" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* --- Logout Modal --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Sign Out</h3>
              <p className="text-gray-500 text-sm mb-6">Are you sure you want to sign out?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-200 transition active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}