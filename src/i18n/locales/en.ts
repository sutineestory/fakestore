/** Source of truth for message keys; every other locale must match this shape. */
export const en = {
  common: {
    retry: 'Try again',
    ok: 'Got it',
    cart: 'Cart',
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
    search: 'Search hot deals',
    noResults: (query: string) => `No hot deals match “${query}”.`,
    noCategoryResults: 'No hot deals in the chosen categories.',
    filter: {
      button: (count: number) => (count === 0 ? 'Filter' : `Filter (${count})`),
      title: 'Filter by category',
      loading: 'Loading categories',
      error: 'Couldn’t load the categories.',
      empty: 'No categories yet.',
      clear: 'Clear',
      done: 'Done',
    },
    sort: {
      button: 'Sort',
      title: 'Sort by',
      options: {
        recommended: 'Recommended',
        priceLowToHigh: 'Price: low to high',
        priceHighToLow: 'Price: high to low',
        rating: 'Top rated',
        title: 'Name: A to Z',
      },
    },
    rating: (rate: number, count: number) => `${rate.toFixed(1)} (${count})`,
  },
  productDetail: {
    title: 'Product details',
    addToCart: 'Add to cart',
    viewCart: 'In cart · View cart',
    viewImage: 'View larger image',
    closeImage: 'Close',
    loading: 'Loading the product',
    error: 'Couldn’t load this product.',
    notFound: 'This product doesn’t exist any more.',
    rating: (rate: number, count: number) =>
      `Rated ${rate.toFixed(1)} out of 5 · ${count} reviews`,
  },
  cart: {
    title: 'Cart',
    loading: 'Loading your cart',
    error: 'Couldn’t load your cart.',
    empty: 'Your cart is empty.',
    itemCount: (count: number) => (count === 1 ? '1 item' : `${count} items`),
    removeItem: (title: string) => `Remove ${title} from the cart`,
    removeAll: 'Remove all',
    total: 'Total',
    submit: 'Submit order',
    fullTitle: 'Your cart is full',
    fullMessage: (max: number) =>
      `You can have up to ${max} items in your cart. Remove one to add another.`,
  },
  favorites: {
    label: 'Favorite',
    add: 'Add to favorites',
    remove: 'Remove from favorites',
    fullTitle: 'Favorites are full',
    fullMessage: (max: number) =>
      `You can keep up to ${max} favorites. Remove one to add another.`,
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
