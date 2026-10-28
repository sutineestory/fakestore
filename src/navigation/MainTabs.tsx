import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HouseIcon, SettingsIcon, ShoppingBagIcon } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { ProductListScreen } from '@/features/products';
import { useTranslation } from '@/i18n';
import { HomeScreen } from '@/screens/HomeScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { spacing } from '@/theme';
import { headerCartButton } from './headerCartButton';
import { tabIcon } from './TabIcon';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const homeTabIcon = tabIcon(HouseIcon);
const productsTabIcon = tabIcon(ShoppingBagIcon);
const settingsTabIcon = tabIcon(SettingsIcon);

export function MainTabs() {
  const t = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t.tabs.home, tabBarIcon: homeTabIcon }}
      />
      <Tab.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: t.tabs.products,
          tabBarIcon: productsTabIcon,
          headerRight: headerCartButton,
          headerRightContainerStyle: styles.headerRight,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t.tabs.settings, tabBarIcon: settingsTabIcon }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // The tab header, unlike the native stack's, adds no inset of its own.
  headerRight: { paddingRight: spacing.lg },
});
