import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { name: "Home", href: "/" },
    { name: "Upload", href: "/file-upload" },
    { name: "CPU", href: "/cpu-scheduling" },
    { name: "Disk", href: "/disk-scheduling" },
    { name: "Docs", href: "/docs" },
  ];

  return (
    <nav className="relative z-10 bg-[#0A1F2B] text-white py-6">
      <div className="max-w-7xl mx-auto px-3 lg:px-4 flex justify-between items-center">
        <a
          href="/"
          className="flex items-center space-x-2 border border-sky-300 bg-[#01090fcb] py-3 px-5 rounded-full"
        >
          <span className="block w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full"></span>
          <span className="text-xl font-semibold">AlgoScheduler</span>
        </a>

        <div className="hidden md:flex md:items-center border border-sky-300 md:space-x-6 bg-[#01090fcb] py-2 px-4 rounded-full">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-2 font-medium hover:text-teal-300 transition"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-3 bg-[#1d587a]"
          >
            <div className="px-4 pt-4 pb-2 space-y-1">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 font-medium hover:text-teal-300 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
