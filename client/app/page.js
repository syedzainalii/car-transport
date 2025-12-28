'use client'
import Navbar from "./Components/Navbar";
import Header from "./Components/Header";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import { useState, useEffect } from "react";
import Services from "./Components/Services";
import Car from "./Components/Car";
import About from "./Components/About";


export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && 
        window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = '';
    }
  }, [isDarkMode])

  return (
    <div className="min-h-screen font-outfit overflow-x-hidden">

      <div className="relative z-50">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
      </div>
      

      <Header isDarkMode={isDarkMode} />
      <Services isDarkMode={isDarkMode} />
      <Car isDarkMode={isDarkMode} />
      <About isDarkMode={isDarkMode} />

      <main className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl">
        <Contact isDarkMode={isDarkMode} />
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}