"use client"
import { serviceData, assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'

const Services = () => {
  return (
    <div 
        id='services'
        className='w-full px-[12%] py-10 scroll-mt-20'
    >
        <h4 className='text-center mb-1 text-xl font-Ovo text-orange-600'>
            What we offer
        </h4>
        
        <h2 className='text-center sm:text-5xl font-Ovo'>
            Our Services
        </h2>

        <p className='text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo'>
            Offering reliable, comfortable, and on-time transport services between Dubai and Abu Dhabi, both ways.
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-10'>
            {serviceData.map(({icon, title, description}, index) => (
                <div 
                    key={index}
                    className='border border-gray-400 dark:border-gray-600 rounded-2xl p-8 
                               cursor-pointer transition-all duration-500 flex flex-col h-full w-full group
                               hover:bg-lightHover hover:shadow-[4px_4px_0_#000] 
                               dark:bg-darkHover dark:hover:bg-darkHover dark:hover:shadow-[4px_4px_0_#fff]'
                >
                    <div className='transition-transform duration-300 group-hover:scale-110'>
                        <Image src={icon} alt={title} className='w-10' />
                    </div>
                    
                    <h3 className='text-lg my-4 font-semibold dark:text-white'>
                        {title}
                    </h3>
                    
                    <p className='text-sm text-gray-700 leading-5 dark:text-white/80'>
                        {description}
                    </p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Services