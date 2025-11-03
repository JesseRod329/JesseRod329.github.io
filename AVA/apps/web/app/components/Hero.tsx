'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 gradient-bg opacity-20"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="fade-in-up">
          {/* Subtle Badge */}
          <div className="inline-block glass rounded-full px-6 py-2 mb-8 fade-in">
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
              ✨ Premium Nail Art & Design
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-fluid-hero font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
              Nails by
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Elyanna
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-fluid-subtitle text-text-secondary mb-12 max-w-2xl mx-auto">
            Transform your nails into works of art with stunning designs,
            premium products, and expert craftsmanship.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 hover-lift"
            >
              Book Appointment
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              View Gallery
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                500+
              </div>
              <div className="text-text-secondary text-sm mt-2">
                Happy Clients
              </div>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                5
              </div>
              <div className="text-text-secondary text-sm mt-2">
                Years Experience
              </div>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
                100%
              </div>
              <div className="text-text-secondary text-sm mt-2">
                Satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-gradient-to-b from-pink-400 to-blue-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}


