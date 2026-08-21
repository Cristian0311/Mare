import { User, ChevronDown } from 'lucide-react';
import { Input } from '../ui/Input';
import { CheckoutData } from '../../hooks/useCheckoutForm';
import { useState, useEffect } from 'react';

interface CustomerInformationProps {
  data: CheckoutData;
  updateField: (field: keyof CheckoutData, value: string) => void;
  errors: Partial<Record<keyof CheckoutData, string>>;
}

const COUNTRY_CODES = [
  { code: '+53', label: 'Cuba (+53)' },
  { code: '+1', label: 'USA (+1)' },
  { code: '+34', label: 'España (+34)' },
  { code: '+52', label: 'México (+52)' },
];

export function CustomerInformation({ data, updateField, errors }: CustomerInformationProps) {
  // Inicializamos el código de país buscando si el teléfono actual ya tiene uno de los conocidos.
  // Si está vacío, por defecto será Cuba.
  const [countryCode, setCountryCode] = useState('+53');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (data.telefono) {
      const matchedCode = COUNTRY_CODES.find(c => data.telefono.startsWith(c.code));
      if (matchedCode) {
        setCountryCode(matchedCode.code);
        setPhoneNumber(data.telefono.substring(matchedCode.code.length));
      } else if (data.telefono.startsWith('+')) {
        // Podría ser un código diferente ingresado manualmente, pero no está en la lista. 
        // Lo dejamos como está en el input.
        setPhoneNumber(data.telefono);
      } else {
        setPhoneNumber(data.telefono);
      }
    }
  }, []); // Solo al montar

  const handlePhoneChange = (newCode: string, newNumber: string) => {
    setCountryCode(newCode);
    setPhoneNumber(newNumber);
    // Removemos espacios extras antes de actualizar
    const cleanNumber = newNumber.replace(/\s/g, '');
    if (cleanNumber === '') {
      updateField('telefono', '');
    } else {
      updateField('telefono', `${newCode}${cleanNumber}`);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-mare-navy/5 rounded-lg">
          <User className="w-4 h-4 text-mare-navy" />
        </div>
        <h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">02 — CLIENTE</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-1">
          <Input
            label="Nombre completo *"
            placeholder="Ej: Carlos Rodríguez"
            value={data.nombre}
            onChange={(e) => updateField('nombre', e.target.value)}
            error={errors.nombre}
            className="rounded-xl text-sm font-bold"
            autoComplete="name"
          />
        </div>
        <div className="sm:col-span-1">
          <div className="flex flex-col w-full">
            <label className="text-sm font-semibold text-mare-navy mb-1.5 ml-1">
              Teléfono *
            </label>
            <div className="flex relative items-center">
              <div className="relative h-full">
                <select
                  value={countryCode}
                  onChange={(e) => handlePhoneChange(e.target.value, phoneNumber)}
                  className="appearance-none h-[52px] rounded-l-2xl border border-r-0 border-gray-200 bg-gray-50/50 pl-4 pr-10 py-3 text-sm font-black text-mare-navy focus:border-mare-turquoise focus:outline-none focus:ring-4 focus:ring-mare-turquoise/5 z-10 relative transition-all cursor-pointer"
                >
                  {COUNTRY_CODES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-20" />
              </div>
              <input
                type="tel"
                placeholder={countryCode === '+53' ? '5555 5555' : 'Número de contacto'}
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(countryCode, e.target.value)}
                autoComplete="tel-national"
                className={`w-full min-h-[52px] rounded-r-2xl border border-gray-200 bg-white px-4 py-3 text-base text-mare-navy transition-all duration-200 placeholder:text-gray-300 focus:border-mare-turquoise focus:outline-none focus:ring-4 focus:ring-mare-turquoise/5 font-bold
                  ${errors.telefono ? 'border-red-300 focus:border-red-500 focus:ring-red-500/5' : ''}
                `}
              />
            </div>
            {errors.telefono && <p className="mt-1.5 text-sm text-red-500 ml-1 font-medium">{errors.telefono}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
