"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { carData } from "@/assets/assets";

const CarDetailsPage = () => {
  const params = useParams();
  const carId = parseInt(params.id);
  const car = carData.find((c) => c.id === carId);
  const [selectedImage, setSelectedImage] = useState(0);

  // Generate multiple views of the same car image
  const carImages = car ? [car.image, car.image, car.image, car.image] : [];

  // Default data for cars (since your carData doesn't have all fields)
  const carDetails = car ? {
    year: "2024",
    seats: "5",
    transmission: "Automatic",
    fuel: "Petrol",
    description: `Experience luxury and performance with the ${car.title}. This premium ${car.brand} vehicle combines elegant design with cutting-edge technology for an unforgettable driving experience.`,
    features: [
      "Premium leather interior",
      "Advanced safety systems",
      "Climate control",
      "Bluetooth connectivity",
      "Cruise control",
      "Parking sensors"
    ],
    specs: {
      topSpeed: "180 mph",
      acceleration: "0-60 in 5.2s",
      fuelEconomy: "32 MPG",
      engineSize: "2.0L Turbo"
    }
  } : null;

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkTheme">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Car not found
          </h2>
          <Link
            href="/#car"
            className="text-orange-500 hover:text-orange-600 underline"
          >
            Back to cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkTheme transition-colors duration-300">
      {/* Header/Navigation */}
      <div className="bg-white dark:bg-darkTheme border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/#car"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span className="font-medium">Back to Cars</span>
          </Link>
          <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
            Book Now
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-white dark:bg-darkHover shadow-xl">
              <Image
                src={carImages[selectedImage]}
                alt={car.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {carImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-orange-500 scale-105"
                      : "border-gray-200 dark:border-zinc-700 hover:border-orange-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${car.title} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Car Details */}
          <div className="space-y-8">
            {/* Title & Brand */}
            <div>
              <p className="text-sm text-orange-500 font-semibold uppercase tracking-wider mb-2">
                {car.brand}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {car.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {carDetails.description}
              </p>
            </div>

            {/* Price Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-sm opacity-90 mb-1">Starting from</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{car.price}</span>
                <span className="text-lg opacity-90">/day</span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-darkHover rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Year</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {carDetails.year}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-darkHover rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Seats</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {carDetails.seats} People
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-darkHover rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Transmission</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {carDetails.transmission}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-darkHover rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fuel Type</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {carDetails.fuel}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
                Book This Car
              </button>
              <button className="px-6 py-4 border-2 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-colors font-semibold">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Features & Specs Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {/* Features */}
          <div className="bg-white dark:bg-darkHover rounded-2xl p-8 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Key Features
            </h3>
            <ul className="space-y-4">
              {carDetails.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="bg-white dark:bg-darkHover rounded-2xl p-8 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Specifications
            </h3>
            <div className="space-y-4">
              {Object.entries(carDetails.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-zinc-700 last:border-0"
                >
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;