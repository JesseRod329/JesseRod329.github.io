import Navigation from '../components/Navigation';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-fluid-hero font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            Get in Touch
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Book your appointment or reach out with any questions. We&apos;d love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact & Booking Section */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <div>
              <BookingForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="glass rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">📞</div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a href="tel:+1234567890" className="text-text-secondary hover:text-white transition-colors">
                        (555) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">✉️</div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:hello@nailsbyelyanna.com" className="text-text-secondary hover:text-white transition-colors">
                        hello@nailsbyelyanna.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">📍</div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-text-secondary">
                        123 Beauty Street<br />
                        Suite 456<br />
                        Your City, ST 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">🕐</div>
                    <div>
                      <h3 className="font-semibold mb-1">Hours</h3>
                      <div className="text-text-secondary space-y-1">
                        <p>Monday - Friday: 10:00 AM - 7:00 PM</p>
                        <p>Saturday: 10:00 AM - 8:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="glass rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-14 h-14 glass rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110 text-2xl"
                    aria-label="Instagram"
                  >
                    📷
                  </a>
                  <a
                    href="#"
                    className="w-14 h-14 glass rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110 text-2xl"
                    aria-label="Facebook"
                  >
                    👤
                  </a>
                  <a
                    href="#"
                    className="w-14 h-14 glass rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110 text-2xl"
                    aria-label="TikTok"
                  >
                    🎵
                  </a>
                </div>
              </div>

              {/* FAQ */}
              <div className="glass rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6">Quick FAQ</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">How long does a session take?</h4>
                    <p className="text-text-secondary text-sm">
                      Manicures typically take 45-60 minutes, while pedicures take 60-75 minutes.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do I need to book in advance?</h4>
                    <p className="text-text-secondary text-sm">
                      Yes, we recommend booking at least 1-2 weeks in advance for best availability.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                    <p className="text-text-secondary text-sm">
                      We accept cash, credit cards, and digital payments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


