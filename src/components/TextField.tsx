import { useState, type Ref } from 'react';
import {
  TextInput,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { makeStyles, useTheme } from '@/theme';
import { Stack } from './Stack';
import { Text } from './Text';

export type TextFieldProps = TextInputProps & {
  ref?: Ref<TextInputInstance>;
  label?: string;
  helperText?: string;
  /** Error message; replaces `helperText` and highlights the field. */
  error?: string;
};

export function TextField({
  ref,
  label,
  helperText,
  error,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.danger
    : focused
    ? colors.primary
    : colors.border;
  const message = error ?? helperText;

  return (
    <Stack gap="xs">
      {label ? <Text variant="label">{label}</Text> : null}
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        style={[styles.input, { borderColor }, style]}
        onFocus={event => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={event => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...rest}
      />
      {message ? (
        <Text variant="caption" color={error ? 'danger' : 'textMuted'}>
          {message}
        </Text>
      ) : null}
    </Stack>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii, typography }) => ({
  input: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    color: colors.text,
    // lineHeight is intentionally omitted: it misaligns TextInput text on iOS.
    fontSize: typography.body.fontSize,
  },
}));
