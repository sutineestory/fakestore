import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { Stack } from './Stack';
import { Text } from './Text';

export type NoticeSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  okLabel: string;
  onClose: () => void;
};

/** Bottom sheet with a short explanation and one button to dismiss it. */
export function NoticeSheet({
  visible,
  title,
  message,
  okLabel,
  onClose,
}: NoticeSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Stack gap="lg">
        <Stack gap="sm">
          <Text variant="heading" accessibilityRole="header">
            {title}
          </Text>
          <Text color="textMuted">{message}</Text>
        </Stack>
        <Button title={okLabel} onPress={onClose} />
      </Stack>
    </BottomSheet>
  );
}
