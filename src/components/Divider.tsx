import { StyleSheet, View } from 'react-native';

import { makeStyles } from '@/theme';

export function Divider() {
  const styles = useStyles();
  return <View accessible={false} style={styles.divider} />;
}

const useStyles = makeStyles(({ colors }) => ({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
}));
