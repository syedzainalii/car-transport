import car1 from './car1.png';
import car2 from './car2.png';
import car3 from './car3.png';
import car4 from './car4.png';
import car5 from './car5.png';
import car6 from './car6.png';
import car7 from './car7.png';
import car8 from './car8.png';
import right_arrow_white from './right-arrow-white.png';
import logo from './logo.png';
import logo_dark from './logo_dark.png';
import mail_icon from './mail_icon.png';
import mail_icon_dark from './mail_icon_dark.png';
import download_icon from './download-icon.png';
import hand_icon from './hand-icon.png';
import header_bg_color from './header-bg-color.png';
import moon_icon from './moon_icon.png';
import sun_icon from './sun_icon.png';
import arrow_icon from './arrow-icon.png';
import arrow_icon_dark from './arrow-icon-dark.png';
import menu_black from './menu-black.png';
import menu_white from './menu-white.png';
import close_black from './close-black.png';
import close_white from './close-white.png';
import right_arrow from './right-arrow.png';
import send_icon from './send-icon.png';
import right_arrow_bold from './right-arrow-bold.png';
import right_arrow_bold_dark from './right-arrow-bold-dark.png';
import github_logo from './github-logo.png';
import github_logo_dark from './github-logo-dark.png';
import linkendin_logo from './linkendin-logo.png';
import linkendin_logo_dark from './linkendin-logo-dark.png';
import location from './location.png';
import location_dark from './location-dark.png';
import phone from './phone.png';
import phone_dark from './phone-dark.png';
import download_icon_dark from './download-icon-dark.png';
import right_arrow_light from './right-arrow-light.png';
import carlogo from './carlogo.png';
import user_image from './user_image.png';

export const assets = {
    car1,
    car2,
    car3,
    car4,
    car5,
    car6,
    car7,
    car8,
    right_arrow_white,
    logo,
    logo_dark,
    mail_icon,
    mail_icon_dark,
    download_icon,
    hand_icon,
    header_bg_color,
    moon_icon,
    sun_icon,
    arrow_icon,
    arrow_icon_dark,
    menu_black,
    menu_white,
    close_black,
    close_white,
    right_arrow,
    send_icon,
    right_arrow_bold,
    right_arrow_bold_dark,
    linkendin_logo,
    linkendin_logo_dark,
    github_logo,
    github_logo_dark,
    location,
    location_dark,
    phone,
    phone_dark,
    download_icon_dark,
    right_arrow_light,
    carlogo,
    user_image,
};

export const serviceData = [
    { 
        icon: assets.carlogo, 
        title: 'Office, School, Airport Pick & Drop', 
        description: 'Providing 24/7 reliable pick and drop services...', 
        
    },
    { 
        icon: assets.carlogo, 
        title: 'Family Tours', 
        description: 'Providing comfortable and safe rides for family outings...', 
        
    },
    { 
        icon: assets.carlogo, 
        title: 'Sharing or Private Rides', 
        description: 'Offering both shared and private ride options for your convenience...', 
       
    },
        { 
        icon: assets.carlogo, 
        title: 'Reservation', 
        description: 'Reserve your ride in advance to ensure availability...', 
       
    },

];
export const carData = [

    {
        id: 1,
        image: assets.car1,
        price: "$85",
        title: "Audi A8 L",
        brand: "AUDI",
        year: "2024",
        seats: "5",
        transmission: "Automatic",
        fuel: "Petrol",
        description: "The Audi A8 L represents the pinnacle of luxury and digital innovation. With its spacious interior and high-end materials, it offers a first-class traveling experience.",
        features: ["Bang & Olufsen Sound", "Matrix LED Headlights", "Adaptive Air Suspension", "Massage Seats"],
        specs: {
            topSpeed: "155 mph",
            acceleration: "0-60 in 4.5s",
            fuelEconomy: "24 MPG",
            engineSize: "3.0L V6"
        }
    },
    {
        id: 2,
        image: assets.car2,
        price: "$120",
        title: "Range Rover Vogue",
        brand: "RANGE ROVER",
        year: "2024",
        seats: "7",
        transmission: "Automatic",
        fuel: "Diesel",
        description: "Unrivaled refinement and capability. The Range Rover Vogue provides a sanctuary of calm while tackling the most challenging terrains with ease.",
        features: ["All-Wheel Drive", "Panoramic Sunroof", "Pivi Pro Infotainment", "Terrain Response 2"],
        specs: {
            topSpeed: "130 mph",
            acceleration: "0-60 in 6.1s",
            fuelEconomy: "28 MPG",
            engineSize: "3.0L 6-Cylinder"
        }
    },
    {
        id: 3,
        image: assets.car3,
        price: "$60",
        title: "Chevrolet Corvette",
        brand: "CHEVROLET",
        year: "2023",
        seats: "2",
        transmission: "Dual-Clutch",
        fuel: "Petrol",
        description: "A mid-engine masterpiece that stays true to its racing roots. This Chevrolet offers supercar performance with everyday usability.",
        features: ["Performance Data Recorder", "Bose Premium Audio", "Z51 Performance Package", "Head-Up Display"],
        specs: {
            topSpeed: "194 mph",
            acceleration: "0-60 in 2.9s",
            fuelEconomy: "19 MPG",
            engineSize: "6.2L V8"
        }
    },
    {
        id: 4,
        image: assets.car4,
        price: "$95",
        title: "Mercedes-Benz S-Class",
        brand: "MERCEDES",
        year: "2024",
        seats: "5",
        transmission: "9G-TRONIC",
        fuel: "Hybrid",
        description: "The S-Class is the center of the Mercedes-Benz universe. It combines intelligent drive systems with a level of luxury that sets the global standard.",
        features: ["MBUX Hyperscreen", "Rear-Axle Steering", "Burmester 4D Sound", "Ambient Lighting"],
        specs: {
            topSpeed: "155 mph",
            acceleration: "0-60 in 4.4s",
            fuelEconomy: "55 MPGe",
            engineSize: "3.0L Inline-6 Turbo"
        }
    },
    {
        id: 5,
        image: assets.car5,
        price: "$250",
        title: "Bugatti Chiron",
        brand: "BUGATTI",
        year: "2023",
        seats: "2",
        transmission: "Automatic",
        fuel: "Petrol",
        description: "The fastest, most powerful, and exclusive production super sports car in BUGATTI’s history. A true work of automotive art.",
        features: ["Carbon Fiber Body", "Titanium Exhaust", "Diamond-membrane Speakers", "Active Aerodynamics"],
        specs: {
            topSpeed: "261 mph",
            acceleration: "0-60 in 2.4s",
            fuelEconomy: "11 MPG",
            engineSize: "8.0L W16"
        }
    },
    {
        id: 6,
        image: assets.car6,
        price: "$40",
        title: "Honda Civic Type R",
        brand: "HONDA",
        year: "2024",
        seats: "4",
        transmission: "Manual",
        fuel: "Petrol",
        description: "The ultimate high-performance hatchback. Engineering excellence meets aggressive styling for an exhilarating front-wheel-drive experience.",
        features: ["LogR Datalogger", "Brembo Brakes", "Type R Sport Seats", "Wireless Charging"],
        specs: {
            topSpeed: "169 mph",
            acceleration: "0-60 in 5.2s",
            fuelEconomy: "25 MPG",
            engineSize: "2.0L VTEC Turbo"
        }
    },
    {
        id: 7,
        image: assets.car7,
        price: "$35",
        title: "Toyota Corolla GR",
        brand: "TOYOTA",
        year: "2024",
        seats: "5",
        transmission: "Manual",
        fuel: "Petrol",
        description: "Born from rally racing, the GR Corolla is a wild, triple-exhaust-piped beast that brings excitement to every corner.",
        features: ["GR-FOUR AWD System", "Circuit Edition Hood", "Torsen Limited Slip", "Toyota Safety Sense"],
        specs: {
            topSpeed: "143 mph",
            acceleration: "0-60 in 4.9s",
            fuelEconomy: "24 MPG",
            engineSize: "1.6L 3-Cylinder Turbo"
        }
    },
    {
        id: 8,
        image: assets.car8,
        price: "$30",
        title: "Suzuki Swift Sport",
        brand: "SUZUKI",
        year: "2023",
        seats: "5",
        transmission: "Manual",
        fuel: "Petrol",
        description: "A lightweight pocket rocket. The Swift Sport proves that you don't need massive horsepower to have massive amounts of fun.",
        features: ["Lightweight Chassis", "Sport Suspension", "Smartphone Linkage", "Keyless Entry"],
        specs: {
            topSpeed: "130 mph",
            acceleration: "0-60 in 8.1s",
            fuelEconomy: "38 MPG",
            engineSize: "1.4L BoosterJet"
        }
    }
];