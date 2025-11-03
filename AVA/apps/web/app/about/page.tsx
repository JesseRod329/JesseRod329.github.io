import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-fluid-hero font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            About Elyanna
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Passion, artistry, and dedication in every nail
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 mb-12">
            <h2 className="text-fluid-title font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
              My Story
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Hi, I&apos;m Elyanna, a passionate nail artist with over 5 years of experience transforming
                nails into works of art. What started as a hobby has blossomed into a full-fledged passion
                for creating stunning designs that make people feel confident and beautiful.
              </p>
              <p>
                My journey began in 2019 when I fell in love with the intricate world of nail art during
                my certification training. Since then, I&apos;ve dedicated myself to mastering every technique,
                from classic French tips to cutting-edge artistic designs that push the boundaries of creativity.
              </p>
              <p>
                I believe that nails are more than just polish and paint—they&apos;re a form of self-expression,
                a statement piece that completes your look and boosts your confidence. That&apos;s why I approach
                every appointment with care, attention to detail, and genuine excitement about bringing your vision to life.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass rounded-3xl p-8 text-center fade-in">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-text-secondary">
                Only the finest products and techniques for lasting results
              </p>
            </div>
            <div className="glass rounded-3xl p-8 text-center fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3">Creative Excellence</h3>
              <p className="text-text-secondary">
                Unique designs tailored to your personal style and preferences
              </p>
            </div>
            <div className="glass rounded-3xl p-8 text-center fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-3">Unmatched Service</h3>
              <p className="text-text-secondary">
                A welcoming space where every client feels valued and pampered
              </p>
            </div>
          </div>

          {/* Credentials Section */}
          <div className="glass rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
              Credentials & Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold mb-2">Certifications</h4>
                  <ul className="space-y-2 text-text-secondary">
                    <li>• Licensed Nail Technician</li>
                    <li>• Gel Polish Specialist Certification</li>
                    <li>• Acrylic Application Mastery</li>
                    <li>• Advanced Nail Art Techniques</li>
                    <li>• Nail Health & Safety Certified</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold mb-2">Specializations</h4>
                  <ul className="space-y-2 text-text-secondary">
                    <li>• Gel Manicures & Pedicures</li>
                    <li>• Acrylic Extensions & Refills</li>
                    <li>• Custom Nail Art Design</li>
                    <li>• Bridal & Special Event Nails</li>
                    <li>• Nail Restoration & Repair</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-fluid-title font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            The Studio
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            A serene, modern space designed for your comfort and relaxation while we create your perfect nails.
          </p>
          <div className="glass rounded-3xl p-8 md:p-16 aspect-[16/9] flex items-center justify-center">
            <div className="text-6xl mb-4">🏪</div>
          </div>
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
                Let&apos;s Create Together
              </h2>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Ready to experience premium nail artistry? Book your appointment and join our community
                of satisfied clients.
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


