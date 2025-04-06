import React, { useEffect, useState } from 'react';

// Define the type for our symbols
interface Symbol {
  id: string;
  type: 'chat' | 'tweet' | 'heart' | 'star' | 'like';
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
  blurAmount: string;
}

const AnimatedBackground: React.FC = () => {
  // Initialize state with the proper type
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  
  const generateSymbols = () => {
    const initialSymbols: Symbol[] = [];
    for (let i = 0; i < 20; i++) {
      initialSymbols.push(createRandomSymbol());
    }
    setSymbols(initialSymbols);
  };
  
  const addNewSymbol = () => {
    setSymbols(prevSymbols => {
      const newSymbols = [...prevSymbols];
      
      // Remove oldest symbol if there are too many
      if (newSymbols.length > 30) {
        newSymbols.shift();
      }
      
      // Add new symbol
      newSymbols.push(createRandomSymbol());
      return newSymbols;
    });
  };
  
  const createRandomSymbol = (): Symbol => {
    // Add more symbol types for variety
    const symbolTypes: Symbol['type'][] = ['chat', 'tweet', 'heart', 'star', 'like'];
    return {
      id: Math.random().toString(36).substring(2),
      type: symbolTypes[Math.floor(Math.random() * symbolTypes.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.8,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.4 + 0.2,
      animationDuration: Math.random() * 15 + 20,
      animationDelay: Math.random() * 5,
      blurAmount: Math.random() > 0.7 ? `blur(${Math.random() * 2}px)` : 'none'
    };
  };
  
  // Fix the dependency array issue by defining these functions inside useEffect
  useEffect(() => {
    // Generate initial symbols
    generateSymbols();
    
    // Add new symbols periodically
    const interval = setInterval(() => {
      addNewSymbol();
    }, 1800);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const renderSymbol = (type: Symbol['type']) => {
    switch(type) {
      case 'chat':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="drop-shadow-md">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      case 'tweet':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="drop-shadow-md">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
          </svg>
        );
      case 'heart':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="drop-shadow-md">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case 'star':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="drop-shadow-md">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      case 'like':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="drop-shadow-md">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-blue-100">
      {/* Enhanced background with light gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 opacity-70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.5),transparent_70%)] opacity-60"></div>
      
      {symbols.map(symbol => (
        <div 
          key={symbol.id}
          className="absolute transform transition-opacity"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            opacity: symbol.opacity,
            transform: `scale(${symbol.size}) rotate(${symbol.rotation}deg)`,
            animation: `float ${symbol.animationDuration}s infinite ease-in-out ${symbol.animationDelay}s`,
            filter: symbol.blurAmount
          }}
        >
          {renderSymbol(symbol.type)}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          20% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          40% { transform: translateY(10px) translateX(15px) rotate(-3deg); }
          60% { transform: translateY(-15px) translateX(-10px) rotate(2deg); }
          80% { transform: translateY(5px) translateX(-15px) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;