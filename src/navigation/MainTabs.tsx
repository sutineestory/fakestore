import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HouseIcon, SettingsIcon } from 'lucide-react-native';

import { useTranslation } from '@/i18n';
import { HomeScreen } from '@/screens/HomeScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { tabIcon } from './TabIcon';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const homeTabIcon = tabIcon(HouseIcon);
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
        name="Settings"
        component={SettingsScreen}
        options={{ title: t.tabs.settings, tabBarIcon: settingsTabIcon }}
      />
    </Tab.Navigator>
  );
}
