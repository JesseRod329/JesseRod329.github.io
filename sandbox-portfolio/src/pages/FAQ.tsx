export default function FAQ() {
  document.title = 'FAQ • Sandbox'
  return (
    <div className="p-6 md:p-10 max-w-3xl space-y-4">
      <h1 className="text-2xl">FAQ</h1>
      <details>
        <summary className="cursor-pointer text-white/80">What is this sandbox?</summary>
        <div className="text-white/70">A separate branch for portfolio experiments, isolated from main.</div>
      </details>
      <details>
        <summary className="cursor-pointer text-white/80">Will this deploy to main?</summary>
        <div className="text-white/70">No. Changes remain in the sandbox branch until explicitly merged after approval.</div>
      </details>
    </div>
  )
}
