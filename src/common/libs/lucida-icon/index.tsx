import { LucideProps, icons } from 'lucide-react';

interface IconProps extends LucideProps {
  name: keyof typeof icons
  size?: number
}
const Icon = ({ name, size = 12, ...props }: IconProps) => {
  const LucideIcon = icons[name]

  return <LucideIcon size={size} {...props} />;
};

export default Icon;