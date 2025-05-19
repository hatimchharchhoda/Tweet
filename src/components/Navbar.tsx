"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Flame,
  User,
  MessageSquare,
  Globe,
  UserCircle2,
  LogOut,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/Home", icon: <Home size={18} /> },
  { label: "Trending", href: "/Trending", icon: <Flame size={18} /> },
  { label: "Latest News", href: "/News", icon: <Globe size={18} /> },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const username = session?.user?.username || "??";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-md shadow-md px-6 py-3 flex items-center justify-between"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
        <MessageSquare className="w-6 h-6 animate-pulse" />
        <span className="tracking-tight">TweetConnect</span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-4 items-center">
        {navItems.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
        {isAuthenticated && (
          <Link
            href="/MyTweet"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
          >
            <User size={18} />
            <span>My Tweets</span>
          </Link>
        )}
      </div>

      {/* Authentication UI */}
      <div className="relative flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              className="rounded-full bg-primary text-white w-10 h-10 hover:scale-105 transition-transform"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {username.slice(0, 2).toUpperCase()}
            </Button>

            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-2 z-50"
              >
                <span className="block text-sm px-2 py-1 text-gray-500 dark:text-gray-300">
                  Hello, {username}
                </span>
                <Link
                  href="/Profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
                >
                  <UserCircle2 size={16} />
                  Profile
                </Link>
                <Link
                  href="/Settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded-md"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <>
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-primary border-gray-300 hover:bg-gray-100 transition"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;