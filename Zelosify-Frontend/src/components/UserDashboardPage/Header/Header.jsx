"use client";
import { memo, useEffect, useState, useRef } from "react";
import { Moon, Search, Sun, Bell, Settings } from "lucide-react";
import UserProfile from "./UserProfile";
import Notification from "./Notification";
import { useTheme } from "next-themes";

const Header = memo(({ isSidebarOpen }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Unified function to close both when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get current theme (Use resolvedTheme to correctly detect system theme)
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  // Toggle Notifications
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications((prev) => !prev);
    setIsProfileOpen(false); // Close profile if notification opens
  };

  // Toggle Profile
  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileOpen((prev) => !prev);
    setShowNotifications(false); // Close notifications if profile opens
  };

  return (
    <header
      className={`${
        isSidebarOpen ? "pl-[12rem]" : "pl-[5rem]"
      } h-16 flex items-center justify-between sticky top-0 z-40 bg-white border-b border-gray-100 px-6`}
    >
      {/* Left Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search openings, candidates..."
            className="pl-9 pr-4 py-1.5 w-full border border-gray-200 bg-[#f8fafc] rounded-[4px] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all placeholder:text-gray-400 text-black font-normal"
          />
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        {/* Toggle Theme Switch */}
        <label className="relative inline-flex items-center cursor-pointer scale-75">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={currentTheme === "dark"}
            onChange={() =>
              setTheme(currentTheme === "dark" ? "light" : "dark")
            }
          />
          <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 dark:border dark:border-gray-700 rounded-full peer peer-checked:after:translate-x-6 rtl:peer-checked:after:-translate-x-6 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black">
            {currentTheme === "dark" ? (
              <Moon className="absolute left-1 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
            ) : (
              <Sun className="absolute right-1 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
            )}
          </div>
        </label>

        {/* Bell Button */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="p-1.5 rounded-full hover:bg-gray-50 text-gray-500 transition-colors relative"
          >
            <Bell className="h-5 w-5 stroke-[2px]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Settings Button */}
        <button className="p-1.5 rounded-full hover:bg-gray-50 text-gray-500 transition-colors">
          <Settings className="h-5 w-5 stroke-[2px]" />
        </button>

        {/* User Profile */}
        <UserProfile
          toggleNotifications={toggleNotifications}
          isProfileOpen={isProfileOpen}
          toggleProfile={toggleProfile}
          profileRef={profileRef}
        />
      </div>

      {/* Notification Popup */}
      {showNotifications && (
        <Notification
          notificationRef={notificationRef}
          setShowNotifications={setShowNotifications}
        />
      )}
    </header>
  );
});

Header.displayName = "Header";
export default Header;
