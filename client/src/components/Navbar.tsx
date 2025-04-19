import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [isHomePage, setIsHomePage] = useState(true);

  useEffect(() => {
    setIsHomePage(location === "/");
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-teal-500 py-4 px-6 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-white text-xl font-bold">
            Medi<span className="text-gray-900">mate</span>
          </span>
        </Link>
        
        {isHomePage ? (
          // Home page navigation (About, Features, Contact sections)
          <div className="hidden md:flex space-x-6">
            <a href="#about" className="text-white hover:text-gray-200">
              About
            </a>
            <a href="#features" className="text-white hover:text-gray-200">
              Features
            </a>
            <a href="#contact" className="text-white hover:text-gray-200">
              Contact
            </a>
            <Link href="/dashboard" className="text-white hover:text-gray-200 font-bold">
              Dashboard
            </Link>
          </div>
        ) : (
          // App navigation for feature pages
          <div className="hidden md:flex space-x-4">
            <Link href="/dashboard" className="text-white hover:text-gray-200">
              Dashboard
            </Link>
            <Link href="/medications" className="text-white hover:text-gray-200">
              Medications
            </Link>
            <Link href="/reminders" className="text-white hover:text-gray-200">
              Reminders
            </Link>
            <Link href="/appointments" className="text-white hover:text-gray-200">
              Appointments
            </Link>
            <Link href="/profiles" className="text-white hover:text-gray-200">
              Profiles
            </Link>
            <Link href="/sharing" className="text-white hover:text-gray-200">
              Sharing
            </Link>
            <Link href="/med-info" className="text-white hover:text-gray-200">
              Med Info
            </Link>
            <Link href="/tutorials" className="text-white hover:text-gray-200">
              Tutorials
            </Link>
            <Link href="/settings" className="text-white hover:text-gray-200">
              Settings
            </Link>
          </div>
        )}
        
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`md:hidden bg-teal-700 absolute w-full left-0 py-2 px-4 ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        {isHomePage ? (
          // Home page mobile menu
          <>
            <a
              href="#about"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#features"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#contact"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <Link
              href="/dashboard"
              className="block py-2 text-white hover:text-gray-200 font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </>
        ) : (
          // App mobile menu
          <>
            <Link
              href="/dashboard"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/medications"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Medications
            </Link>
            <Link
              href="/reminders"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reminders
            </Link>
            <Link
              href="/appointments"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Appointments
            </Link>
            <Link
              href="/profiles"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profiles
            </Link>
            <Link
              href="/sharing"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sharing
            </Link>
            <Link
              href="/med-info"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Med Info
            </Link>
            <Link
              href="/tutorials"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tutorials
            </Link>
            <Link
              href="/settings"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <Link
              href="/"
              className="block py-2 text-white hover:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
