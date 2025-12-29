"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { carAPI } from "@/app/lib/api";
import { carData } from "@/assets/assets";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Car = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await carAPI.getAll(true); // Get only active cars
        setCars(data.cars || []);
      } catch (err) {
        console.error('Failed to load cars (using local assets):', err);
        // Fallback to local assets if API fails
        setCars(carData || []);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);
  return (
    <section
      id="car"
      className="py-16 px-6 bg-white dark:bg-darkTheme transition-colors duration-300"
    >
      <style jsx global>{`
        .swiper-pagination-bullets.swiper-pagination-horizontal {
          bottom: -16px !important;
        }
        .swiper-pagination-bullet-active {
          background: #f97316 !important;
        }
      `}</style>

      {/* Section Header */}
      <div className="text-center mb-12">
        <h4 className="text-orange-500 uppercase tracking-widest text-sm font-semibold">
          What We Offer
        </h4>
        <h2 className="text-4xl font-bold mt-2 text-gray-800 dark:text-gray-100">
          Choose Your Car
        </h2>
      </div>

      <div className="max-w-7xl mx-auto  relative group">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: ".button-next",
            prevEl: ".button-prev",
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-16 px-2"
        >
          {loading ? (
            <SwiperSlide className="py-4">
              <div className="flex items-center justify-center h-64">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            </SwiperSlide>
          ) : cars.length === 0 ? (
            <SwiperSlide className="py-4">
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 dark:text-gray-400">No cars available</p>
              </div>
            </SwiperSlide>
          ) : (
            cars.map((car) => {
              const img = car.image || car.image_url;
              const title = car.name || car.title;
              const brand = car.brand || car.brand;
              const id = car.id;
              return (
              <SwiperSlide key={car.id} className="py-4">
                <div className="bg-white dark:bg-darkHover border border-gray-200 dark:border-darkHover rounded-xl overflow-hidden group/card transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Car+Image';
                      }}
                    />
                  </div>

                  {/* Content Details */}
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {title}
                    </h3>
                    {brand && (
                      <p className="text-xs text-gray-400 dark:text-zinc-500 tracking-widest uppercase mb-6">
                        {brand}
                      </p>
                    )}

                    <div className="flex gap-2">
                      {/* Primary Booking Button */}
                      <a
                        href="#top"
                        className="flex-1 py-2 border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all rounded-md text-center"
                      >
                        Book now
                      </a>

                      {/* Detail Link - Routes to /car/[id] */}
                      <Link
                        href={`/car/${id}`}
                        className="flex-1 py-2 border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all rounded-md text-center"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
            })
          )}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="button-prev absolute top-[40%] -left-4 lg:-left-6 transform -translate-y-1/2 z-20 bg-white dark:bg-darkHover border border-gray-200 dark:border-zinc-800 p-3 rounded-full shadow-xl text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-0 active:scale-90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button className="button-next absolute top-[40%] -right-4 lg:-right-6 transform -translate-y-1/2 z-20 bg-white dark:bg-darkHover border border-gray-200 dark:border-zinc-800 p-3 rounded-full shadow-xl text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-0 active:scale-90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor "
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Car;
