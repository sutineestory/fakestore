import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';

import { SampleScreen } from '@/features/sample';
import { useTranslation } from '@/i18n';
import { DetailsScreen } from '@/screens/DetailsScreen';
import { useTheme } from '@/theme';
import { MainTabs } from './MainTabs';
import { toNavigationTheme } from './navigationTheme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const t = useTranslation();
  const theme = useTheme();
  const navigationTheme = useMemo(() => toNavigationTheme(theme), [theme]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          // Pushed screens sit on the tab container, whose name isn't user-facing.
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen
          name="Sample"
          component={SampleScreen}
          options={{ title: t.sample.title }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
