import dynamic from 'next/dynamic'
import { LucideProps, icons } from 'lucide-react';

interface IconProps extends LucideProps {
  name: keyof typeof icons
  size?: number
}
const Icon = ({ name, size = 14, ...props }: IconProps) => {
  const LucideIcon = icons[name]

  return <LucideIcon size={12} {...props} />;
};

export default Icon;