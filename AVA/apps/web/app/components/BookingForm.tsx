'use client';

import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitStatus('success');
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        message: '',
      });
      setSubmitStatus('idle');
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 lg:p-12">
      <h2 className="text-fluid-title font-bold mb-8 text-center">
        Book Your Appointment
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Service */}
        <div>
          <label className="block text-sm font-medium mb-2">Service</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
          >
            <option value="">Select a service</option>
            <option value="gel-manicure">Gel Manicure</option>
            <option value="gel-pedicure">Gel Pedicure</option>
            <option value="acrylic-full-set">Acrylic Full Set</option>
            <option value="nail-art">Nail Art Design</option>
            <option value="nail-restoration">Nail Restoration</option>
            <option value="special-event">Special Event Package</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Message */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Additional Notes</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-pink-500 focus:outline-none transition-colors resize-none"
          placeholder="Tell us about your style preferences..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || submitStatus === 'success'}
        className="w-full mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? 'Booking...' : submitStatus === 'success' ? '✓ Booked Successfully!' : 'Confirm Booking'}
      </button>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="mt-6 text-center text-green-400">
          We&apos;ll be in touch soon to confirm your appointment!
        </div>
      )}
    </form>
  );
}


