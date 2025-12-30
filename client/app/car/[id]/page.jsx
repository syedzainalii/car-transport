"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { carAPI } from "@/app/lib/api";

const CarDetailsPage = () => {
  const params = useParams();
  const carId = parseInt(params.id);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await carAPI.getAll(false); // get all cars
        const found = (data.cars || []).find((c) => c.id === carId);
        if (!found) {
          setError("Car not found");
        } else {
          setCar(found);
        }
      } catch (err) {
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkTheme">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-200">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkTheme">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {error || "Car not found"}
          </h2>
          <Link
            href="/#car"
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors inline-block"
          >
            Return to Fleet
          </Link>
        </div>
      </div>
    );
  }

  // Gallery images (if only one image, repeat for gallery)
  const carImages = [car.image_url, car.image_url, car.image_url, car.image_url];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkTheme transition-colors duration-300">
      
      {/* --- HEADER / NAVIGATION --- */}
      <div className="bg-white dark:bg-darkTheme border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/#car"
            className="group flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-all duration-300"
          >
            <div className="p-2 rounded-full group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </div>
            <span className="font-semibold text-sm uppercase tracking-wider">Back to Fleet</span>
          </Link>

          <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md shadow-orange-500/20">
            Book Now
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN: IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-white dark:bg-darkHover shadow-xl">
              <Image 
                src={carImages[selectedImage]} 
                alt={car.title} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {carImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(idx)} 
                  className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx 
                      ? "border-orange-500 scale-105 shadow-md" 
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: CAR INFO */}
          <div className="space-y-8">
            <div>
              <p className="text-sm text-orange-500 font-semibold uppercase tracking-wider mb-2">
                {car.brand}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {car.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {car.description}
              </p>
            </div>


            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Seats", value: `${car.seats} People`, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },

              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-darkHover rounded-xl p-4 border border-gray-200 dark:border-zinc-700 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-bold text-lg shadow-lg hover:shadow-orange-500/20 active:scale-95">
                Reserve This Vehicle
              </button>
              <button className="p-4 border-2 border-gray-200 dark:border-zinc-700 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* --- FEATURES LOWER SECTION --- */}
        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          
          {/* Key Features List */}
          <div className="bg-white dark:bg-darkHover rounded-2xl p-8 border border-gray-200 dark:border-zinc-700 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
              Key Features
            </h3>
            <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
              {car.features?.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;