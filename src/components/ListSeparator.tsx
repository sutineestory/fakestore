import { View } from 'react-native';

import { makeStyles } from '@/theme';

/** Gap between vertical list rows; pass as `ItemSeparatorComponent`. */
export function ListSeparator() {
  const styles = useStyles();
  return <View style={styles.separator} />;
}

const useStyles = makeStyles(({ spacing }) => ({
  separator: { height: spacing.md },
}));
