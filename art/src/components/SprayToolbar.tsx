
interface SprayToolbarProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export default function SprayToolbar({
  colors,
  selectedColor,
  onSelectColor,
}: SprayToolbarProps) {
  return (
    <div className="bg-black/80 backdrop-blur-sm p-4">
      <div className="flex justify-center gap-4 flex-wrap">
        {colors.map((color) => (
          <SprayCan
            key={color}
            color={color}
            isSelected={color === selectedColor}
            onClick={() => onSelectColor(color)}
            asCursor={false}
          />
        ))}
      </div>
    </div>
  );
}

export interface SprayCanProps {
  color: string;
  isSelected: boolean;
  onClick?: () => void;
  asCursor?: boolean;
  showNozzleDot?: boolean;
  metallic?: boolean;
}

export function SprayCan({
  color,
  isSelected,
  onClick,
  asCursor = false,
  showNozzleDot = false,
  metallic = false,
}: SprayCanProps) {
  const canStyle = {
    backgroundColor: color,
    border: isSelected ? '3px solid #fff' : '2px solid #333',
    boxShadow: isSelected ? '0 0 20px rgba(255,255,255,0.5)' : '0 4px 8px rgba(0,0,0,0.3)',
  };

  return (
    <div
      className={`relative ${asCursor ? 'pointer-events-none' : 'cursor-pointer'} transition-transform hover:scale-105`}
      onClick={onClick}
      style={{
        width: asCursor ? '60px' : '50px',
        height: asCursor ? '80px' : '70px',
      }}
    >
      {/* Spray can body */}
      <div
        className="relative rounded-t-lg rounded-b-sm"
        style={{
          ...canStyle,
          width: '100%',
          height: '85%',
        }}
      >
        {/* Nozzle */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"
          style={{
            width: '8px',
            height: '12px',
            backgroundColor: '#333',
            borderRadius: '2px',
          }}
        />
        
        {/* Nozzle tip dot (for debug) */}
        {showNozzleDot && (
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2"
            style={{
              width: '4px',
              height: '4px',
              backgroundColor: '#ff0000',
              borderRadius: '50%',
            }}
          />
        )}
        
        {/* Spray can label area */}
        <div
          className="absolute top-2 left-1 right-1 h-4 bg-white/20 rounded"
        />
        
        {/* Metallic shine effect */}
        {metallic && (
          <div className="absolute inset-0 rounded-t-lg rounded-b-sm bg-gradient-to-br from-white/40 via-transparent to-transparent" />
        )}
        
        {/* Spray can bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 rounded-b-sm"
        />
      </div>
      
      {/* Spray can cap */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"
        style={{
          width: '12px',
          height: '8px',
          backgroundColor: '#666',
          borderRadius: '2px',
        }}
      />
    </div>
  );
}
