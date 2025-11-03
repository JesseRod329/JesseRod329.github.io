import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-32 pt-16 pb-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-black"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
              Nails by Elyanna
            </h3>
            <p className="text-text-secondary mb-4 max-w-md">
              Transforming nails into works of art. Premium services, exceptional quality,
              and a touch of creativity in every design.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <span className="text-xl">📷</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <span className="text-xl">👤</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110"
                aria-label="TikTok"
              >
                <span className="text-xl">🎵</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-secondary hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-text-secondary hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-text-secondary hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-secondary hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  📞 (555) 123-4567
                </a>
              </li>
              <li>
                <a href="mailto:hello@nailsbyelyanna.com" className="hover:text-white transition-colors">
                  ✉️ hello@nailsbyelyanna.com
                </a>
              </li>
              <li className="pt-2">
                <span className="text-sm">Mon - Sat: 10AM - 8PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Copyright */}
        <div className="text-center text-text-secondary text-sm">
          <p>
            &copy; {new Date().getFullYear()} Nails by Elyanna. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


