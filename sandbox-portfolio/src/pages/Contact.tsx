export default function Contact() {
  document.title = 'Contact • Sandbox'
  return (
    <div className="p-6 md:p-10 max-w-xl">
      <h1 className="text-2xl mb-4">Contact</h1>
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()} aria-label="Contact form">
        <label className="block text-sm">
          <span className="block mb-1 text-white/70">Your email</span>
          <input type="email" required className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
        </label>
        <label className="block text-sm">
          <span className="block mb-1 text-white/70">Message</span>
          <textarea required rows={4} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
        </label>
        <button className="px-3 py-2 border border-white/15 rounded">Send</button>
      </form>
    </div>
  )
}
