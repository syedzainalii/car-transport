"use client"
import { assets, carData } from '@/assets/assets'
import { useState, useEffect } from 'react';

const Header = ({ isDarkMode }) => {
  const slides = [
    {
      image: assets.car1,
      title: 'PrimePath',
      subtitle: 'Precision Timing for the Modern Professional',
      description: 'Whether you’re heading to a high-stakes board meeting or catching a red-eye flight, PrimePath ensures you arrive composed and on schedule.'
    },
    {
      image: assets.car2,
      title: 'SwiftLoop',
      subtitle: 'Your City, Just a Tap Away',
      description: 'Navigate the urban jungle without the stress of parking or traffic.'
    },
    {
      image: assets.car3,
      title: 'GreenGlide',
      subtitle: 'Clean Rides for a Greener Tomorrow',
      description: 'Move across town with a zero-carbon footprint.'
    },
    {
      image: assets.car4,
      title: 'NeighborRide',
      subtitle: 'Friendly Faces, Fairer Fares.',
      description: 'Quality transport shouldn\'t break the bank.'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className='relative w-screen h-[95vh] flex items-center justify-center overflow-hidden mt-20'>
      
      {/* BACKGROUND SLIDESHOW */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.image.src || slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark Overlay for better text readability */}
          <div className='absolute inset-0 bg-black/50'></div>
        </div>
      ))}

      {/* MAIN UI CONTAINER - Swapped Order here */}
      <div className='relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12'>
        
        {/* LEFT SIDE: Animated Text Content */}
        <div className='relative flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 min-h-[300px]'>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 flex flex-col items-center lg:items-start justify-center ${
                index === currentSlide 
                ? 'opacity-100 translate-x-0 pointer-events-auto' 
                : 'opacity-0 -translate-x-12 pointer-events-none'
              }`}
            >
              <h4 className='uppercase tracking-[0.3em] text-sm md:text-base font-bold text-white mb-2'>
                {slide.subtitle}
              </h4>

              <h1 className='text-4xl md:text-6xl lg:text-7xl font-light uppercase text-white leading-tight'>
                {slide.title}
              </h1>

              <p className='text-lg md:text-xl font-ovo mt-4 mb-10 text-white/90 max-w-md'>
                {slide.description}
              </p>
              
              <a 
                href="#car"
                className='px-12 md:px-16 py-3 border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-orange-500 hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-bold text-white'
              >
                VIEW OFFER
              </a>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE: Booking Form Block */}
        <div className="bg-white dark:bg-darkHover p-6 md:p-8 rounded-sm shadow-2xl w-full max-w-md animate-fadeIn z-20">
          <h2 className="text-2xl dark:text-white font-bold text-gray-800 mb-6">Make your trip</h2>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pick-up Location</label>
              <input type="text" placeholder="City, Airport, Station, etc" className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-orange-400  dark:text-gray-500 transition-colors text-gray-800" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Drop-off Location</label>
              <input type="text" placeholder="City, Airport, Station, etc" className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-orange-400 transition-colors text-gray-800 dark:text-gray-500" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Select Car</label>
              <select className="w-full border border-gray-200 dark:bg-darkHover p-3 text-sm text-gray-500 focus:outline-none focus:border-orange-400 transition-colors bg-white cursor-pointer">
                <option value="">Choose a Vehicle</option>
                {carData.map((car) => (
                  <option key={car.id} value={car.title}>
                    {car.brand} - {car.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pick-up Date</label>
                <input type="date" className="w-full border border-gray-200 p-3 text-sm text-gray-500   focus:outline-none dark:[color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pick-up Time</label>
                <input type="time" className="w-full border border-gray-200 p-3 text-sm text-gray-500 focus:outline-none dark:[color-scheme:dark]" />
              </div>
            </div>

            <button type="submit" className="w-full bg-white border-2 border-orange-500 dark:bg-darkHover text-orange-600 font-bold py-4 mt-2 transition-all duration-300 hover:bg-orange-500 hover:text-white uppercase tracking-widest text-sm shadow-md active:scale-[0.98]">
              Book Ride
            </button>
          </form>
        </div>

      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 backdrop-blur-md p-4 rounded-full text-white transition-all'>
        ‹
      </button>
      <button onClick={nextSlide} className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 backdrop-blur-md p-4 rounded-full text-white transition-all'>
        ›
      </button>

      {/* Indicators */}
      <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 transition-all duration-500 ${
                index === currentSlide ? 'bg-orange-500 w-12' : 'bg-white/40 w-6'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Header;