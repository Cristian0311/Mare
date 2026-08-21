import React from 'react';
import { 
  FaHome, 
  FaPlug, 
  FaLaptop, 
  FaTshirt, 
  FaShoePrints, 
  FaSpa, 
  FaGem, 
  FaAppleAlt, 
  FaSoap, 
  FaHeartbeat, 
  FaBaby, 
  FaBriefcase, 
  FaDumbbell, 
  FaCar, 
  FaTools, 
  FaPaw, 
  FaPen, 
  FaGamepad, 
  FaGift, 
  FaBoxOpen,
  FaTv,
  FaCouch,
  FaUtensils,
  FaGlasses,
  FaRing,
  FaBicycle
} from 'react-icons/fa';
import { 
  MdCleaningServices, 
  MdOutlinePets,
  MdOutlineChildFriendly,
  MdOutlineWeekend,
  MdKitchen
} from 'react-icons/md';
import { GiLipstick, GiNecklaceDisplay, GiPerfumeBottle } from 'react-icons/gi';

export const getCategoryIcon = (iconName: string | undefined, className: string = "w-5 h-5") => {
  const defaultIcon = <FaBoxOpen className={className} />;
  
  if (!iconName) return defaultIcon;

  const iconMap: Record<string, React.ReactNode> = {
    'hogar': <FaHome className={className} />,
    'electrodomesticos': <FaPlug className={className} />,
    'tecnologia': <FaLaptop className={className} />,
    'ropa': <FaTshirt className={className} />,
    'calzado': <FaShoePrints className={className} />,
    'belleza': <FaSpa className={className} />,
    'bisuteria': <FaGem className={className} />,
    'alimentos': <FaAppleAlt className={className} />,
    'aseo': <FaSoap className={className} />,
    'salud': <FaHeartbeat className={className} />,
    'ninos': <FaBaby className={className} />,
    'mochilas': <FaBriefcase className={className} />,
    'deportes': <FaDumbbell className={className} />,
    'automotor': <FaCar className={className} />,
    'ferreteria': <FaTools className={className} />,
    'mascotas': <FaPaw className={className} />,
    'oficina': <FaPen className={className} />,
    'gaming': <FaGamepad className={className} />,
    'regalos': <FaGift className={className} />,
    'otros': <FaBoxOpen className={className} />,
    'tv': <FaTv className={className} />,
    'muebles': <FaCouch className={className} />,
    'cocina': <MdKitchen className={className} />,
    'limpieza': <MdCleaningServices className={className} />,
    'gafas': <FaGlasses className={className} />,
    'anillos': <FaRing className={className} />,
    'collares': <GiNecklaceDisplay className={className} />,
    'maquillaje': <GiLipstick className={className} />,
    'perfume': <GiPerfumeBottle className={className} />,
    'bicicleta': <FaBicycle className={className} />,
    // Legacy maps to preserve compatibility
    'apple': <FaAppleAlt className={className} />,
    'droplet': <FaSoap className={className} />,
    'heart': <FaHeartbeat className={className} />,
    'laptop': <FaLaptop className={className} />,
    'speaker': <FaTv className={className} />,
    'armchair': <FaCouch className={className} />,
    'utensils': <FaUtensils className={className} />,
    'shirt': <FaTshirt className={className} />,
    'footprints': <FaShoePrints className={className} />,
    'briefcase': <FaBriefcase className={className} />,
    'gem': <FaGem className={className} />,
    'sparkles': <FaSpa className={className} />,
    'baby': <FaBaby className={className} />,
    'gamepad-2': <FaGamepad className={className} />,
    'dumbbell': <FaDumbbell className={className} />,
    'car': <FaCar className={className} />,
    'wrench': <FaTools className={className} />,
    'zap': <FaPlug className={className} />,
    'wifi': <FaLaptop className={className} />,
    'dog': <FaPaw className={className} />,
    'gift': <FaGift className={className} />,
    'tent': <FaHome className={className} />,
    'box': <FaBoxOpen className={className} />,
    'monitor': <FaTv className={className} />,
  };

  return iconMap[iconName.toLowerCase()] || defaultIcon;
};
