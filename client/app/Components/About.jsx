"use client"
import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const About = () => {
  const [aboutBlock, setAboutBlock] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAbout() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/public/content?key=about`);
        const data = await res.json();
        
        if (data.success && data.content.about) {
          setAboutBlock(data.content.about);
        } else {
          setAboutBlock(null);
        }
      } catch (err) {
        console.error('Failed to load about content:', err);
        setAboutBlock(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <section id="about" className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </section>
    );
  }

  // Fallback to default content if no backend data
  if (!aboutBlock) {
    return (
      <section id="about" className="max-w-7xl mx-auto py-16 px-6 bg-white dark:bg-darkTheme transition-colors duration-300">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16">
          <div className="w-56 sm:w-130 rounded-3xl shrink-0 items-center shadow-lg">
            <Image
              src={assets.user_image}
              alt="About Us"
              className="w-full h-auto object-cover rounded-xl"
              priority
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <h4 className="text-orange-500 uppercase tracking-widest text-s font-bold mb-3">
              About Us
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-8 leading-tight">
              Choose A Perfect Car
            </h2>
            <div className="font-sans text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed text-left mb-8 space-y-6">
              <p>We offer premium transportation services with a wide range of luxury vehicles.</p>
            </div>
            <a href="#car">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md transition-all duration-300 shadow-md">
                Search Vehicle
              </button>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="max-w-7xl mx-auto py-16 px-6 bg-white dark:bg-darkTheme transition-colors duration-300">
      <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16">
        {/* Image */}
        <div className="w-56 sm:w-130 rounded-3xl shrink-0 items-center shadow-lg">
          <Image
            src={aboutBlock.media_url ? `${API_URL}${aboutBlock.media_url}` : assets.user_image}
            alt={aboutBlock.title || 'About Us'}
            width={400}
            height={400}
            className="w-full h-auto object-cover rounded-xl"
            priority
          />
        </div>
        
        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start">
          <h4 className="text-orange-500 uppercase tracking-widest text-s font-bold mb-3">
            {aboutBlock.title || 'About Us'}
          </h4>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-8 leading-tight">
            {aboutBlock.content?.split('\n')[0] || 'Choose A Perfect Car'}
          </h2>
          <div className="font-sans text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed text-left mb-8 space-y-6">
            {aboutBlock.content?.split('\n').slice(1).map((p, i) => (
              <p key={i}>{p}</p>
            )) || <p>We offer premium transportation services.</p>}
          </div>
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