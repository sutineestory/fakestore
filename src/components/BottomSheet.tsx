import type { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { makeStyles } from '@/theme';

export type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

/**
 * Panel that rises from the bottom over a dimmed screen. Tapping the dimmed
 * area or Android back closes it; give the content its own close button too.
 */
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const styles = useStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        accessible={false}
        onPress={onClose}
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        testID="bottom-sheet-backdrop"
      />
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {children}
      </SafeAreaView>
    </Modal>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  backdrop: { backgroundColor: colors.scrim },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.xl,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    backgroundColor: colors.surface,
  },
}));
