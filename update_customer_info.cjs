const fs = require('fs');
const content = `import { User } from 'lucide-react';
import { Input } from '../ui/Input';
import { CheckoutData } from '../../hooks/useCheckoutForm';

interface CustomerInformationProps {
  data: CheckoutData;
  updateField: (field: keyof CheckoutData, value: string) => void;
  errors: Partial<Record<keyof CheckoutData, string>>;
}

export function CustomerInformation({ data, updateField, errors }: CustomerInformationProps) {
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
          <Input
            label="Teléfono *"
            type="tel"
            placeholder="Número de contacto"
            value={data.telefono}
            onChange={(e) => updateField('telefono', e.target.value)}
            error={errors.telefono}
            className="rounded-xl text-sm font-bold"
            autoComplete="tel"
          />
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync('src/components/checkout/CustomerInformation.tsx', content);
