import { XIcon } from 'lucide-react-native';
import { Image, Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { makeStyles, useTheme } from '@/theme';
import { Icon } from './Icon';

const MAX_ZOOM = 4;

export type ImageViewerProps = {
  uri: string;
  visible: boolean;
  onClose: () => void;
  closeLabel: string;
};

/**
 * Full-screen view of one image. Pinch to zoom works on iOS only: Android's
 * ScrollView has no zoom, so there it is just shown large.
 */
export function ImageViewer({
  uri,
  visible,
  onClose,
  closeLabel,
}: ImageViewerProps) {
  const { spacing } = useTheme();
  const styles = useStyles();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
    >
      <SafeAreaView style={styles.container}>
        {/* In the layout, not absolutely placed: absolute offsets ignore the
            safe-area padding and would put the button under the notch. */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
            hitSlop={spacing.sm}
            onPress={onClose}
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}
          >
            <Icon icon={XIcon} />
          </Pressable>
        </View>
        <ScrollView
          maximumZoomScale={MAX_ZOOM}
          minimumZoomScale={1}
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Image source={{ uri }} resizeMode="contain" style={styles.image} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  container: { flex: 1, backgroundColor: colors.media },
  content: { flexGrow: 1 },
  image: { flex: 1 },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  close: {
    padding: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.8 },
}));
