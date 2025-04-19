import { useState } from "react";
import { Link } from "wouter";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        </div>
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
      </div>
    </nav>
  );
};

export default Navbar;
