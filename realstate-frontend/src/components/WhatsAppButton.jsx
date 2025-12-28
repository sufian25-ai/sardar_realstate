import React, { useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { gsap } from 'gsap';

const WhatsAppButton = () => {
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    // Entrance animation
    gsap.from(buttonRef.current, {
      scale: 0,
      rotation: 360,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 1,
    });

    // Floating animation
    gsap.to(buttonRef.current, {
      y: -10,
      duration: 1.5,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });
  }, []);

  const handleClick = () => {
    const phoneNumber = '8801234567890'; // Replace with actual number
    const message = 'Hello! I am interested in your property.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div
        ref={buttonRef}
        className="fixed bottom-6 right-6 z-50 group"
        onClick={handleClick}
      >
        <div className="relative">
          {/* Pulse effect */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          
          {/* Main button */}
          <button
            className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full shadow-2xl hover:shadow-green-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Contact on WhatsApp"
          >
            <MessageCircle className="w-8 h-8 text-white" />
          </button>

          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            <div className="text-sm font-semibold">Chat with us!</div>
            <div className="text-xs text-gray-300">We're online now</div>
            {/* Arrow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppButton;
