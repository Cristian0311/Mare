import { useState, useEffect } from 'react';

export interface CheckoutData {
  nombre: string;
  apellidos: string;
  telefono: string;
  whatsapp: string;
  email: string;
  provincia: string;
  municipio: string;
  direccion: string;
  referencia: string;
  puntoRecogida: string;
  metodoEntrega: 'domicilio' | 'recogida';
  observaciones: string;
}

const DEFAULT_DATA: CheckoutData = {
  nombre: '',
  apellidos: '',
  telefono: '',
  whatsapp: '',
  email: '',
  provincia: 'la-habana',
  municipio: '',
  direccion: '',
  referencia: '',
  puntoRecogida: '',
  metodoEntrega: 'domicilio',
  observaciones: '',
};

export function useCheckoutForm() {
  const [data, setData] = useState<CheckoutData>(() => {
    try {
      const saved = localStorage.getItem('mare_checkout_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_DATA, ...parsed };
        }
      }
    } catch (e) {
      console.error('Error parsing checkout data:', e);
    }
    return DEFAULT_DATA;
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});
  const [isRecovered, setIsRecovered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mare_checkout_data');
    if (saved) {
      setIsRecovered(true);
      const timer = setTimeout(() => setIsRecovered(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mare_checkout_data', JSON.stringify(data));
  }, [data]);

  const updateField = (field: keyof CheckoutData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Reset municipio if provincia changes
    if (field === 'provincia') {
      setData(prev => ({ ...prev, municipio: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutData, string>> = {};
    
    if (!data.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    // validation removed
    
    if (!data.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else {
      const cleanPhone = data.telefono.replace(/\s/g, '');
      if (!/^\+[0-9]{6,15}$/.test(cleanPhone)) {
        newErrors.telefono = 'Formato inválido. Debe incluir el código de país (ej: +53) seguido del número.';
      } else if (cleanPhone.startsWith('+53') && !/^\+53[0-9]{8}$/.test(cleanPhone)) {
        newErrors.telefono = 'Para Cuba (+53), el número debe tener exactamente 8 dígitos.';
      }
    }

    if (data.metodoEntrega === 'domicilio') {
      if (!data.provincia) newErrors.provincia = 'Selecciona una provincia';
      if (!data.municipio) newErrors.municipio = 'Selecciona un municipio';
      if (!data.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
    } else if (data.metodoEntrega === 'recogida') {
      if (!data.puntoRecogida) newErrors.puntoRecogida = 'Selecciona un punto de recogida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^\+[0-9]{6,15}$/.test(cleanPhone)) return false;
    if (cleanPhone.startsWith('+53') && !/^\+53[0-9]{8}$/.test(cleanPhone)) return false;
    return true;
  };

  const isValid = 
    data.nombre.trim() !== '' && 
    isValidPhone(data.telefono) && 
    (data.metodoEntrega === 'recogida' 
      ? (data.puntoRecogida !== '') 
      : (data.provincia !== '' && data.municipio !== '' && data.direccion.trim() !== ''));

  return {
    data,
    updateField,
    errors,
    validate,
    isValid,
    isRecovered
  };
}
