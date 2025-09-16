import PortfolioScene from "../components/PortfolioScene";

export default function Home() {
  return (
    <div className="relative w-full h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <PortfolioScene />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Designer & Developer
        </h1>
        <p className="text-lg md:text-xl text-text/80 max-w-2xl mx-auto">
          I create beautiful and functional websites with a focus on user experience.
        </p>
      </div>
    </div>
  );
}