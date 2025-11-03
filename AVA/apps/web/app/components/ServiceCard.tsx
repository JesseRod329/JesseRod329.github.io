'use client';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  price?: string;
  gradient: string;
  delay?: string;
}

export default function ServiceCard({ icon, title, description, price, gradient, delay = '0' }: ServiceCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl p-8 hover-lift fade-in-up"
      style={{ animationDelay: delay }}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
      ></div>
      
      {/* Glass Overlay */}
      <div className="relative z-10 glass rounded-3xl p-8 h-full flex flex-col">
        {/* Icon */}
        <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          {icon}
        </div>
        
        {/* Content */}
        <h3 className="text-2xl font-bold mb-4 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 transition-all duration-300">
          {title}
        </h3>
        
        <p className="text-text-secondary mb-6 flex-grow">
          {description}
        </p>
        
        {price && (
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            {price}
          </div>
        )}
      </div>
    </div>
  );
}


