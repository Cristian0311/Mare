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
            
            {config.delivery?.pickupLocations?.[0]?.address && (
              <div className="mt-6 text-left bg-white/5 rounded-2xl p-4 border border-white/10 max-w-sm">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mare-turquoise"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-mare-turquoise uppercase tracking-[0.1em] mb-1">Tienda Física</h4>
                    <p className="text-xs font-bold text-white tracking-wide mb-1">
                      {config.delivery.pickupLocations[0].name}
                    </p>
                    <p className="text-[11px] text-gray-400 mb-2 leading-snug">
                      {config.delivery.pickupLocations[0].address}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-mare-turquoise"></div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        {config.delivery.pickupLocations[0].schedule}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              {!(config.features?.catalogMode || !config.delivery?.enabled) && (
                <Link to="/informacion/entregas" className="text-gray-300 hover:text-white transition-colors">
                  Entregas
                </Link>
              )}
              <Link to="/informacion/faq" className="text-gray-300 hover:text-white transition-colors">Preguntas frecuentes</Link>
              <Link to="/informacion/condiciones" className="text-gray-300 hover:text-white transition-colors">Condiciones</Link>
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <h4 className="font-bold text-lg mb-2 text-white">Contacto</h4>
              <button onClick={() => openWhatsApp()} className="text-gray-300 hover:text-white transition-colors">Atención por WhatsApp</button>
              <a 
                href="https://whatsapp.com/channel/0029VbDQEzM6hENkcQneXg35" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-mare-turquoise hover:text-white transition-colors font-bold"
              >
                Canal Oficial de WhatsApp
              </a>
              <Link to="/informacion/contacto" className="text-gray-300 hover:text-white transition-colors">Centro de Atención</Link>
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
