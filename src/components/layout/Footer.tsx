import React, { useState, useEffect } from 'react';
import { configService } from '../../services/config';
import { Logo } from '../ui/Logo';
import { Link } from 'react-router-dom';
import { useWhatsApp } from '../../contexts/WhatsAppContext';

export function Footer() {
  const [config, setConfig] = useState(configService.getConfigSync());
  const { openWhatsApp } = useWhatsApp();

  useEffect(() => {
    const handleConfigUpdate = () => {
      setConfig(configService.getConfigSync());
    };
    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, []);

  return (
    <footer className="bg-mare-navy text-white mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4">
              <Logo textClassName="text-white" iconClassName="text-mare-turquoise" />
            </div>
            <p className="text-mare-turquoise font-medium">{config.eslogan}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-lg mb-2 text-white">Tienda</h4>
              <Link to="/coleccion/ofertas" className="text-gray-300 hover:text-white transition-colors">Ofertas</Link>
              <Link to="/coleccion/novedades" className="text-gray-300 hover:text-white transition-colors">Novedades</Link>
              <Link to="/coleccion/destacados" className="text-gray-300 hover:text-white transition-colors">Destacados</Link>
              {config.wholesale.enabled && (
                <Link to="/informacion/mayoristas" className="text-gray-300 hover:text-white transition-colors font-bold text-mare-turquoise">Mayoristas</Link>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-lg mb-2 text-white">Información</h4>
              <Link to="/informacion/como-comprar" className="text-gray-300 hover:text-white transition-colors">Cómo comprar</Link>
              {config.delivery.enabled && (
                <Link to="/informacion/entregas" className="text-gray-300 hover:text-white transition-colors">Entregas</Link>
              )}
              <Link to="/informacion/faq" className="text-gray-300 hover:text-white transition-colors">Preguntas frecuentes</Link>
              <Link to="/informacion/condiciones" className="text-gray-300 hover:text-white transition-colors">Condiciones</Link>
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <h4 className="font-bold text-lg mb-2 text-white">Contacto</h4>
              <button onClick={() => openWhatsApp()} className="text-gray-300 hover:text-white transition-colors">WhatsApp</button>
              <Link to="/informacion/contacto" className="text-gray-300 hover:text-white transition-colors">Atención al cliente</Link>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            &copy; {new Date().getFullYear()} {config.tiendaNombre}. Todos los derechos reservados.
          </div>
          <div className="text-xs">
            Desarrollado por{' '}
            <a 
              href="https://nexus-digital-studio.onrender.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-mare-turquoise hover:underline font-bold"
            >
              NEXUS DIGITAL STUDIO
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
