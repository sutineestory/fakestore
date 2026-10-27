import type { LucideIcon, LucideProps } from 'lucide-react-native';

import { useTheme, type ColorToken, type IconSize } from '@/theme';

export type IconProps = Omit<LucideProps, 'color' | 'size'> & {
  /** Any Lucide icon, e.g. `HouseIcon`. Browse: https://lucide.dev/icons */
  icon: LucideIcon;
  color?: ColorToken;
  size?: IconSize;
};

/** Lucide icon bound to theme color and size tokens. */
export function Icon({
  icon: IconComponent,
  color = 'text',
  size = 'md',
  ...rest
}: IconProps) {
  const { colors, iconSizes } = useTheme();

  return (
    <IconComponent color={colors[color]} size={iconSizes[size]} {...rest} />
  );
}
