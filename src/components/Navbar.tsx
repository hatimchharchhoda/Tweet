"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Home, Flame, User, MessageSquare, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session, status } = useSession();
  const username = session?.user?.username || "??";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex items-center justify-between fixed top-0 w-full z-50">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-lg">
        <MessageSquare className="w-6 h-6 text-gray-800 dark:text-gray-200" />
        <span>TweetConnect</span>
      </Link>

      {/* Center: Navigation Links */}
      <div className="flex space-x-6">
        <Link href="/Home" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
          <Home size={18} />
          <span>Home</span>
        </Link>

        {isAuthenticated && (
          <>
            <Link href="/MyTweet" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
              <User size={18} />
              <span>My Tweets</span>
            </Link>
          </>
        )}

        <Link href="/Trending" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
          <Flame size={18} />
          <span>Trending</span>
        </Link>

        <Link href="/News" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
          <Globe size={18} />
          <span>Latest News</span>
        </Link>
      </div>

      {/* Right: Authentication UI */}
      <div className="relative">
        {isAuthenticated ? (
          /* User Profile Button and Dropdown when logged in */
          <>
            <Button
              variant="ghost"
              className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-semibold text-lg"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {username.slice(0, 2).toUpperCase()}
            </Button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 z-50">
                <Link href="/Profile" className="block text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                  Profile
                </Link>
                <Link href="/Settings" className="block text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md">
                  Settings
                </Link>
                <button className="w-full text-left text-sm text-red-600 hover:bg-gray-100 p-2 rounded-md" onClick={() => signOut()}>
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          /* Sign In and Sign Up links when not logged in */
          <div className="flex items-center space-x-3">
            <Link href="/signin">
              <Button variant="ghost" className="text-gray-700 hover:text-primary">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;