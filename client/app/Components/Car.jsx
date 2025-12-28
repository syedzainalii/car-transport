"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { carData } from "@/assets/assets";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Car = () => {
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
          {carData.map((car) => (
            <SwiperSlide key={car.id} className="py-4">
              <div className="bg-white dark:bg-darkHover border border-gray-200 dark:border-darkHover rounded-xl overflow-hidden group/card transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={car.image}
                    alt={car.brand}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                  />

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 left-0 bg-white dark:bg-darkHover py-1 px-4 flex items-center shadow-md z-10 rounded-r-lg">
                    <span className="text-orange-500 font-bold text-xl">
                      {car.price}
                    </span>
                    <div className="ml-1 leading-tight">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">
                        From
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">
                        /Day
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                    {car.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 tracking-widest uppercase mb-6">
                    {car.brand}
                  </p>

                  <div className="flex gap-2">
                    {/* Primary Booking Button */}
                    <button className="flex-1 py-2 border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all rounded-md">
                      Book now
                    </button>

                    {/* Detail Link - Routes to /car/[id] */}
                    <Link
                      href={`/car/${car.id}`}
                      className="flex-1 py-2 border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all rounded-md text-center"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
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
