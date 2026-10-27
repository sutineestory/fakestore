import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { useTheme, type ColorToken, type TypographyVariant } from '@/theme';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorToken;
  align?: TextStyle['textAlign'];
};

export function Text({
  variant = 'body',
  color = 'text',
  align,
  style,
  ...rest
}: TextProps) {
  const { colors, typography } = useTheme();

  return (
    <RNText
      style={[
        typography[variant],
        { color: colors[color], textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
}
