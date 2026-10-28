/** Source of truth for message keys; every other locale must match this shape. */
export const en = {
  common: {
    retry: 'Try again',
  },
  tabs: {
    home: 'Home',
    products: 'Products',
    settings: 'Settings',
  },
  home: {
    title: 'Welcome',
    subtitle: 'Tap a card to open the Details screen.',
    openSample: 'Open sample list',
    items: {
      gettingStarted: {
        title: 'Getting started',
        description: 'Project structure, scripts and conventions.',
      },
      designSystem: {
        title: 'Design system',
        description: 'Tokens, light/dark theming and shared components.',
      },
      navigation: {
        title: 'Navigation',
        description: 'Typed native stack with nested bottom tabs.',
      },
      appContext: {
        title: 'App context',
        description:
          'Shared state via React context. Favorite an item to try it.',
      },
    },
  },
  details: {
    itemNumber: (id: string) => `Item #${id}`,
    note: {
      label: 'Note',
      placeholder: 'Type something…',
      helperText: 'Example of the shared TextField component.',
    },
    goBack: 'Go back',
    openSettings: 'Open Settings',
  },
  productList: {
    hotDeals: 'Hot deals',
    favorites: 'Favorites',
    favoritesEmpty: 'Tap “Add to favorites” on a product to keep it here.',
    favoritesError: 'Couldn’t load your favorites.',
    loading: 'Loading products',
    error: 'Couldn’t load the products.',
    empty: 'No products yet.',
    loadMoreError: 'Couldn’t load more products.',
  },
  productDetail: {
    title: 'Product details',
    loading: 'Loading the product',
    error: 'Couldn’t load this product.',
    notFound: 'This product doesn’t exist any more.',
    rating: (rate: number, count: number) =>
      `Rated ${rate.toFixed(1)} out of 5 · ${count} reviews`,
  },
  favorites: {
    label: 'Favorite',
    add: 'Add to favorites',
    remove: 'Remove from favorites',
  },
  sample: {
    title: 'Sample list',
    subtitle: 'Loaded from a mock service. Pull down to refresh.',
    search: 'Search items',
    loading: 'Loading items',
    error: 'Couldn’t load the items.',
    empty: 'No items yet.',
    noResults: (query: string) => `No items match “${query}”.`,
  },
  settings: {
    appearance: 'Appearance',
    colorSchemes: {
      system: 'System',
      light: 'Light',
      dark: 'Dark',
    },
    language: 'Language',
    components: 'Components',
    buttons: {
      primary: 'Primary',
      secondary: 'Secondary',
      ghost: 'Ghost',
      danger: 'Danger',
      loading: 'Loading',
      disabled: 'Disabled',
    },
    card: {
      title: 'Card',
      description: 'Surface container with border and radius tokens.',
    },
  },
};

export type Messages = typeof en;
