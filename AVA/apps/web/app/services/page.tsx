import Navigation from '../components/Navigation';
import ServiceCard from '../components/ServiceCard';
import Footer from '../components/Footer';

export default function ServicesPage() {
  const allServices = [
    {
      icon: '💅',
      title: 'Basic Set',
      description: 'Classic nail set with no designs or charms. Length add-on available.',
      price: '$65',
      gradient: 'bg-gradient-to-br from-pink-500/20 to-purple-500/20',
      delay: '0s',
    },
    {
      icon: '✨',
      title: 'Overlay',
      description: 'ANY DESIGN - This set is for the girlies that love acrylic with no tips on their natural nails.',
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
    {
      icon: '🎨',
      title: 'Gel Manicure',
      description: 'Long-lasting gel polish with endless design options. Pricing varies by design complexity.',
      price: 'Varies',
      gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      delay: '0.4s',
    },
  ];

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-fluid-hero font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            Our Services
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Discover our complete range of premium nail services, each designed to perfection
            and tailored to your unique style.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {allServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-fluid-title font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            Pricing
          </h2>
          <p className="text-xl text-text-secondary mb-12">
            Transparent pricing with no hidden fees. All services include consultation and aftercare instructions.
          </p>
          
          <div className="glass rounded-3xl p-8 text-left">
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-white/10">
                <span className="text-lg">Basic Set</span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">$65</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/10">
                <span className="text-lg">Overlay</span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">$70</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/10">
                <span className="text-lg">French Design</span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">$70</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/10">
                <span className="text-lg">Line French</span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">$60</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-lg">Gel Manicure</span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">Varies</span>
              </div>
            </div>
          </div>

          <p className="text-text-secondary mt-8 text-sm">
            * Length add-ons available. Prices may vary based on design complexity.
          </p>
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
                Ready to Book?
              </h2>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Schedule your appointment and let us create something beautiful together.
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

