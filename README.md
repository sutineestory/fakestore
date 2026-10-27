# MyApp

Bare React Native app (no Expo) for iOS and Android.

| | Version |
| --- | --- |
| React Native | 0.88 (New Architecture) |
| React | 19.3 |
| TypeScript | 6 |
| Navigation | React Navigation 7 (native stack + bottom tabs) |

## Prerequisites

- Node >= 22.11, Watchman
- iOS: Xcode + CocoaPods
- Android: Android Studio / SDK, JDK 17, and `ANDROID_HOME` set:

  ```sh
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
  ```

## Getting started

```sh
npm install
cd ios && pod install && cd ..   # or: bundle install && bundle exec pod install

npm start          # Metro
npm run ios        # in another terminal
npm run android
```

Re-run `pod install` whenever you add a package with native code.

## Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start Metro |
| `npm run ios` / `npm run android` | Build and run on simulator / emulator |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Jest |

## Project structure

```
src/
├── App.tsx              # Providers: SafeArea → Theme → Navigation
├── components/          # Shared UI built on theme tokens
│   ├── Button.tsx       #   primary | secondary | ghost | danger, sm | md | lg, loading
│   ├── Card.tsx         #   surface container, optionally pressable
│   ├── Divider.tsx
│   ├── Icon.tsx         #   Lucide icon with theme color/size tokens
│   ├── Screen.tsx       #   screen root: background, safe area, scroll, padding
│   ├── Stack.tsx        #   flex row/column with token-based `gap`
│   ├── Text.tsx         #   typography `variant` + semantic `color`
│   └── TextField.tsx    #   label, helper text, error state
├── navigation/
│   ├── RootNavigator.tsx  # Native stack: MainTabs, Details, Sample
│   ├── MainTabs.tsx       # Bottom tabs: Home, Settings
│   ├── TabIcon.tsx        # tabIcon(LucideIcon) → tabBarIcon renderer
│   ├── navigationTheme.ts # Maps design tokens → React Navigation theme
│   └── types.ts           # Param lists + typed screen props
├── screens/             # Placeholder screens: Home, Details, Settings
└── theme/
    ├── palette.ts       # Raw colors (do not use in components)
    ├── tokens.ts        # spacing, radii, typography
    ├── themes.ts        # Semantic color tokens for light / dark
    ├── ThemeProvider.tsx# useTheme(), useColorSchemePreference()
    └── makeStyles.ts    # Theme-aware StyleSheet hook
```

## Conventions

**Imports** use the `@/` alias for `src/` (`babel-plugin-module-resolver` + `tsconfig` `paths`):

```ts
import { Button, Screen, Text } from '@/components';
import { makeStyles, useTheme } from '@/theme';
```

**Styling** goes through theme tokens — never hard-code colors or spacing in screens:

```tsx
const useStyles = makeStyles(({ colors, spacing, radii }) => ({
  container: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radii.md },
}));

function MyComponent() {
  const styles = useStyles();
  return <View style={styles.container} />;
}
```

**Icons** come from [Lucide](https://lucide.dev/icons) (`lucide-react-native` + `react-native-svg`). Import the `*Icon` export and render it through the themed `Icon` component; only the icons you import end up in the bundle:

```tsx
import { BellIcon } from 'lucide-react-native';
import { Icon } from '@/components';

<Icon icon={BellIcon} color="primary" size="lg" />
```

For tab bars use `tabIcon(BellIcon)` from `src/navigation/TabIcon.tsx`, hoisted to module scope.

**Theming**: `useColorSchemePreference()` switches between `system`, `light` and `dark` (see the Settings screen). The choice is in memory only; persist it (e.g. MMKV / AsyncStorage) when needed.

**Adding a screen**:

1. Create it in `src/screens/`.
2. Add its route + params to the param list in `src/navigation/types.ts`.
3. Register it in `RootNavigator.tsx` (stack) or `MainTabs.tsx` (tab).
4. Type its props with `RootStackScreenProps<'Name'>` or `MainTabScreenProps<'Name'>`.

## Renaming the app

The app is scaffolded as `MyApp` with bundle ID / application ID `com.myapp`. Change these before the first store submission:

- iOS: `PRODUCT_BUNDLE_IDENTIFIER` in Xcode (target → Signing & Capabilities)
- Android: `namespace` / `applicationId` in `android/app/build.gradle`, and move `android/app/src/main/java/com/myapp/`
