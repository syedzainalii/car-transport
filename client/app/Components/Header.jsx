"use client"
import { assets, carData } from '@/assets/assets'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { carAPI, bookingCreateAPI } from '@/app/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const Header = ({ isDarkMode, user, onLogout }) => {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    pickup_location: '',
    dropoff_location: '',
    car_id: '',
    pickup_date: '',
    pickup_time: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  
  const slides = [
    {
      image: assets.car1,
      title: 'PrimePath',
      subtitle: 'Precision Timing for the Modern Professional',
      description: 'Whether you\'re heading to a high-stakes board meeting or catching a red-eye flight, PrimePath ensures you arrive composed and on schedule.'
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

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoadingCars(true);
        const data = await carAPI.getAll(true); // Get only active cars
        setCars(data.cars || []);
      } catch (err) {
        console.error('Failed to load cars, falling back to bundled assets:', err);
        // fallback to bundled carData so selection works when backend is down
        try {
          setCars(carData || []);
        } catch (e) {
          setCars([]);
        }
      } finally {
        setLoadingCars(false);
      }
    };
    fetchCars();
  }, []);

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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (!bookingForm.pickup_location || !bookingForm.dropoff_location || !bookingForm.car_id) {
      setBookingMessage('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setBookingMessage('');
      
      const selectedCar = cars.find(c => c.id === parseInt(bookingForm.car_id));
      
      const bookingData = {
        pickup_location: bookingForm.pickup_location,
        dropoff_location: bookingForm.dropoff_location,
        car_id: parseInt(bookingForm.car_id),
        car_type: selectedCar ? selectedCar.name : '',
        pickup_date: bookingForm.pickup_date,
        pickup_time: bookingForm.pickup_time
      };

      const result = await bookingCreateAPI.create(bookingData);
      
      if (result.success) {
        setBookingMessage('Booking created successfully! We will contact you soon.');
        // Reset form
        setBookingForm({
          pickup_location: '',
          dropoff_location: '',
          car_id: '',
          pickup_date: '',
          pickup_time: ''
        });
        // Clear message after 5 seconds
        setTimeout(() => setBookingMessage(''), 5000);
      }
    } catch (err) {
      setBookingMessage(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

        {/* MAIN UI CONTAINER */}
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
                {user && (user.role === 'admin' || user.role === 'moderator') && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className='ml-4 px-6 py-3 border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-blue-600 hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-bold text-white'
                  >
                    DASHBOARD
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT SIDE: Booking Form Block */}
          <div className="bg-white dark:bg-darkHover p-6 md:p-8 rounded-sm shadow-2xl w-full max-w-md animate-fadeIn z-20">
            <h2 className="text-2xl dark:text-white font-bold text-gray-800 mb-6">Make your trip</h2>
            
            {user && (
              <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  Booking as: <span className="font-semibold">{user.name}</span>
                </p>
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleBookingSubmit}>
              {bookingMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  bookingMessage.includes('successfully') 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}>
                  {bookingMessage}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pick-up Location</label>
                <input 
                  type="text" 
                  placeholder="City, Airport, Station, etc" 
                  value={bookingForm.pickup_location}
                  onChange={(e) => setBookingForm({ ...bookingForm, pickup_location: e.target.value })}
                  className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-orange-400 dark:text-gray-500 transition-colors text-gray-800 dark:bg-darkHover" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Drop-off Location</label>
                <input 
                  type="text" 
                  placeholder="City, Airport, Station, etc" 
                  value={bookingForm.dropoff_location}
                  onChange={(e) => setBookingForm({ ...bookingForm, dropoff_location: e.target.value })}
                  className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-orange-400 transition-colors text-gray-800 dark:text-gray-500 dark:bg-darkHover" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Select Car</label>
                <select 
                  value={bookingForm.car_id}
                  onChange={(e) => setBookingForm({ ...bookingForm, car_id: e.target.value })}
                  className="w-full border border-gray-200 dark:bg-darkHover p-3 text-sm text-gray-500 focus:outline-none focus:border-orange-400 transition-colors bg-white cursor-pointer"
                  required
                  disabled={loadingCars}
                >
                  <option value="">{loadingCars ? 'Loading cars...' : 'Choose a Vehicle'}</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.brand ? `${car.brand} - ` : ''}{car.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pick-up Date</label>
                  <input 
                    type="date" 
                    value={bookingForm.pickup_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickup_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 p-3 text-sm text-gray-500 focus:outline-none dark:[color-scheme:dark] dark:bg-darkHover" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pick-up Time</label>
                  <input 
                    type="time" 
                    value={bookingForm.pickup_time}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickup_time: e.target.value })}
                    className="w-full border border-gray-200 p-3 text-sm text-gray-500 focus:outline-none dark:[color-scheme:dark] dark:bg-darkHover" 
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-white border-2 border-orange-500 dark:bg-darkHover text-orange-600 font-bold py-4 mt-2 transition-all duration-300 hover:bg-orange-500 hover:text-white uppercase tracking-widest text-sm shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!user || submitting || loadingCars}
              >
                {submitting ? 'Booking...' : user ? 'Book Ride' : 'Login to Book'}
              </button>

              {!user && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  Please <button type="button" onClick={() => router.push('/login')} className="text-orange-500 hover:underline">login</button> to book a ride
                </p>
              )}
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