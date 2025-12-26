import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const About = () => {
  return ( 
    <section id="about" className="max-w-7xl mx-auto py-16 px-6 bg-white dark:bg-darkTheme transition-colors duration-300">
      <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16">
        
        {/* User Image Wrapper */}
        <div className="w-56 sm:w-130 rounded-3xl shrink-0 items-center shadow-lg">
          <Image 
            src={assets.user_image} 
            alt="About Us Car" 
            className="w-full h-auto object-cover rounded-xl"
            priority
          />
        </div>

        {/* Text Content Area */}
        <div className="w-full lg:w-1/2 flex flex-col items-start">
          {/* Subheading */}
          <h4 className="text-orange-500 uppercase tracking-widest text-s font-bold mb-3">
            About Us
          </h4>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-8 leading-tight">
            Choose A Perfect Car
          </h2>

          {/* Description Paragraphs */}
          <div className="font-sans text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed text-left mb-8 space-y-6">
            <p>
              A small river named Duden flows by their place and supplies it with the 
              necessary regelialia. It is a paradisematic country, in which roasted 
              parts of sentences fly into your mouth.
            </p>
            <p>
              On her way she met a copy. The copy warned the Little Blind Text, 
              that where it came from it would have been rewritten a thousand 
              times and everything that was left from its origin would be the 
              word "and" and the Little Blind Text should turn around and return 
              to its own, safe country. But nothing the copy said could convince her.
            </p>
          </div>

          {/* CTA Button */}
          <a href="#car">
  <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md transition-all duration-300 shadow-md">
    Search Vehicle
  </button>
</a>
        </div>
      </div>
    </section>
  );
};

export default About;