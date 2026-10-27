import type { LucideIcon } from 'lucide-react-native';

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

/**
 * Builds a `tabBarIcon` renderer for a Lucide icon. Color comes from the
 * navigator's active/inactive tint; the stroke is bolder on the active tab.
 */
export function tabIcon(Icon: LucideIcon) {
  return ({ focused, color, size }: TabBarIconProps) => (
    <Icon color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
  );
}
