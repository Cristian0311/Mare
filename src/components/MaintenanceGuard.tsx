import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { configService } from '../services/config';
import { MaintenanceScreen } from '../MaintenanceScreen';

interface MaintenanceGuardProps {
  children: ReactNode;
}

export function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const [config, setConfig] = useState(configService.getConfigSync());
  const location = useLocation();

  useEffect(() => {
    const handleUpdate = () => setConfig(configService.getConfigSync());
    window.addEventListener('mare_config_updated', handleUpdate);
    return () => window.removeEventListener('mare_config_updated', handleUpdate);
  }, []);

  // Permitir siempre el acceso al panel de administración aunque esté en mantenimiento
  const isAdminPath = location.pathname.startsWith('/mare0311');

  if (config.maintenance.enabled && !isAdminPath) {
    return <MaintenanceScreen />;
  }

  return <>{children}</>;
}
