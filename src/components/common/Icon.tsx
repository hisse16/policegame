import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-4 h-4', size }) => {
  const allIcons = Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>;
  const Component = allIcons[name] || Icons.File;
  return <Component className={className} size={size} />;
};
