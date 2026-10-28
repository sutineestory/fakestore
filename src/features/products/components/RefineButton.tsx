import type { LucideIcon } from 'lucide-react-native';

import { Button, Icon } from '@/components';

type RefineButtonProps = {
  title: string;
  icon: LucideIcon;
  /** Fills the button in while what it opens is changing the list. */
  active: boolean;
  /** Read out after the title, e.g. the chosen order. */
  value?: string;
  onPress: () => void;
};

/** Small header button that opens one way of refining the hot deals. */
export function RefineButton({
  title,
  icon,
  active,
  value,
  onPress,
}: RefineButtonProps) {
  return (
    <Button
      title={title}
      size="sm"
      variant={active ? 'primary' : 'secondary'}
      icon={
        <Icon icon={icon} size="sm" color={active ? 'onPrimary' : 'text'} />
      }
      accessibilityValue={value ? { text: value } : undefined}
      onPress={onPress}
    />
  );
}
