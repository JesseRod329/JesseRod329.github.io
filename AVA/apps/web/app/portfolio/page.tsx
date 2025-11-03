import Navigation from '../components/Navigation';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';

export default function PortfolioPage() {
  const portfolioImages = [
    { id: 1, src: '/nail1.png', alt: 'Elegant Gel Manicure', category: 'Gel' },
    { id: 2, src: '/nail2.png', alt: 'Glamorous Acrylic Set', category: 'Acrylic' },
    { id: 3, src: '/nail3.png', alt: 'Floral Nail Art Design', category: 'Nail Art' },
    { id: 4, src: '/nail4.png', alt: 'Celebration Glamour Set', category: 'Glamour' },
    { id: 5, src: '/nail5.png', alt: 'Neon Geometric Design', category: 'Nail Art' },
  ];

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-fluid-hero font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            Our Portfolio
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Explore our gallery of stunning nail art designs and transformations.
            Each piece is a work of art crafted with precision and passion.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Gallery images={portfolioImages} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-fluid-title font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                Inspired?
              </h2>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Let&apos;s create something beautiful together. Book your appointment and bring your vision to life.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Book Your Appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

