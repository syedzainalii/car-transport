"use client"
import Image from 'next/image'
import React from 'react'
import { assets } from '@/assets/assets'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const Footer = ({isDarkMode}) => {
  const [footerBlock, setFooterBlock] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchFooter() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/public/content?key=footer`);
        const data = await res.json();
        
        if (data.success && data.content.footer) {
          setFooterBlock(data.content.footer);
        } else {
          setFooterBlock(null);
        }
      } catch (err) {
        console.error('Failed to load footer content:', err);
        setFooterBlock(null);
      } finally {
        setLoading(false);
      }
    }
    fetchFooter();
  }, []);

  // Parse contact details from content
  let contact = {};
  try {
    contact = footerBlock?.content ? JSON.parse(footerBlock.content) : {};
  } catch {
    contact = {};
  }

  return (
    <div className='mt-4'>
      {/* Logo */}
      <div className='mb-4 px-5 sm:px-10 mx-[8%] mt-4'>
        {loading ? (
          <div className="h-9 w-36 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        ) : (
          <Image 
            src={footerBlock?.media_url ? `${API_URL}${footerBlock.media_url}` : assets.logo} 
            alt='Logo' 
            width={144}
            height={36}
            className='w-36'
          />
        )}
      </div>

      {/* Contact Details */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm mb-4 px-5 sm:px-10 mx-[8%] mt-4'>
        <div className='flex items-center gap-2'>
          <Image src={assets.mail_icon} alt='' width={20} height={20} className='w-5 flex-shrink-0'/>
          <span className='break-all dark:text-gray-300'>
            {contact.email || 'contact@example.com'}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Image src={assets.call_icon} alt='' width={20} height={20} className='w-5 flex-shrink-0'/>
          <span className='dark:text-gray-300'>
            {contact.phone || '+92 300 0000000'}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Image src={assets.location_icon} alt='' width={20} height={20} className='w-5 flex-shrink-0'/>
          <span className='dark:text-gray-300'>
            {contact.location || 'Pakistan'}
          </span>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center sm:flex items-center justify-between border-t border-gray-400 mx-[10%] mt-6 py-6">
        <p className='text-sm dark:text-gray-300'>
          {footerBlock?.title || '© 2025 Transport Service. All rights reserved'}
        </p>
        <ul className='flex items-center gap-2 justify-center mt-4 sm:mt-0'>
          <li>
            <a 
              target='_blank' 
              href={contact.linkedin || "https://www.linkedin.com/"}
              rel="noopener noreferrer"
            >
              <Image 
                src={isDarkMode ? assets.linkedin_icon_dark : assets.linkedin_icon} 
                alt="LinkedIn" 
                width={40}
                height={40}
                className="w-10" 
              />
            </a>
          </li>
          <li>
            <a 
              target='_blank' 
              href={contact.github || "https://github.com/"}
              rel="noopener noreferrer"
            >
              <Image 
                src={isDarkMode ? assets.github_icon_dark : assets.github_icon} 
                alt="GitHub" 
                width={32}
                height={32}
                className="w-8" 
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer