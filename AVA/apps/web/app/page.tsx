import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ServiceCard from './components/ServiceCard';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

export default function Home() {
  const services = [
    {
      icon: '💅',
      title: 'Basic Set',
      description: 'Classic nail set with no designs or charms. Perfect for everyday elegance.',
      price: '$65',
      gradient: 'bg-gradient-to-br from-pink-500/20 to-purple-500/20',
      delay: '0s',
    },
    {
      icon: '✨',
      title: 'Overlay',
      description: 'ANY DESIGN - For the girlies that love acrylic with no tips on natural nails.',
      price: '$70',
      gradient: 'bg-gradient-to-br from-purple-500/20 to-blue-500/20',
      delay: '0.1s',
    },
    {
      icon: '💎',
      title: 'French Design',
      description: 'Classic French manicure with elegant design accents. Length add-on available.',
      price: '$70',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-pink-500/20',
      delay: '0.2s',
    },
    {
      icon: '💅🏼',
      title: 'Line French',
      description: 'Modern twist on French design with clean lines. Length add-on available.',
      price: '$60',
      gradient: 'bg-gradient-to-br from-pink-500/20 to-blue-500/20',
      delay: '0.3s',
    },
  ];

  const portfolioImages = [
    { id: 1, src: '/nail1.png', alt: 'Gel Manicure Design', category: 'Gel' },
    { id: 2, src: '/nail2.png', alt: 'Acrylic Nails', category: 'Acrylic' },
    { id: 3, src: '/nail3.png', alt: 'Floral Nail Art', category: 'Nail Art' },
    { id: 4, src: '/nail4.png', alt: 'Glamour Set', category: 'Glamour' },
    { id: 5, src: '/nail5.png', alt: 'Neon Design', category: 'Nail Art' },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      text: 'Elyanna\'s work is absolutely stunning! My nails looked perfect for weeks.',
      rating: 5,
    },
    {
      name: 'Jessica L.',
      text: 'Best nail technician I\'ve ever been to. Her attention to detail is incredible.',
      rating: 5,
    },
    {
      name: 'Maria R.',
      text: 'The designs are always unique and exactly what I imagined. Highly recommend!',
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />

      {/* Services Section */}
      <section id="services" className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-fluid-title font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
              Our Services
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              From classic elegance to bold artistic expression, we offer a range of premium nail services
              tailored to your style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/services"
              className="inline-block px-8 py-4 rounded-full glass hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 hover:text-white transition-all duration-300 font-semibold"
            >
              View All Services →
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section id="portfolio" className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-fluid-title font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
              Our Work
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Explore our gallery of stunning nail art designs and transformations.
            </p>
          </div>

          <Gallery images={portfolioImages} />

          <div className="text-center mt-12">
            <a
              href="/portfolio"
              className="inline-block px-8 py-4 rounded-full glass hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 hover:text-white transition-all duration-300 font-semibold"
            >
              View Full Gallery →
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-fluid-title font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass rounded-3xl p-8 hover-lift fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-text-secondary mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-fluid-title font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                Ready for Your Transformation?
              </h2>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Book your appointment today and experience the difference of premium nail artistry.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Book Appointment Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
