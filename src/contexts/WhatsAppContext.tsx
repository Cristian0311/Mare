import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdvisorSelector } from '../components/ui/AdvisorSelector';
import { Modal } from '../components/ui/Modal';
import { buildWhatsAppUrl } from '../utils/buildWhatsAppUrl';

interface WhatsAppContextType {
  openWhatsApp: (customMessage?: string) => void;
  closeWhatsApp: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>('Hola, quisiera más información sobre la tienda.');

  const openWhatsApp = (customMessage?: string) => {
    setMessage(customMessage || 'Hola, quisiera más información sobre la tienda.');
    setIsOpen(true);
  };

  const closeWhatsApp = () => {
    setIsOpen(false);
  };

  const handleAdvisorSelect = (advisor: any) => {
    setIsOpen(false);
    window.open(buildWhatsAppUrl(advisor.whatsapp, message), '_blank', 'noopener,noreferrer');
  };

  return (
    <WhatsAppContext.Provider value={{ openWhatsApp, closeWhatsApp }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeWhatsApp} title="Atención al Cliente">
        <AdvisorSelector onSelect={handleAdvisorSelect} />
      </Modal>
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
}
