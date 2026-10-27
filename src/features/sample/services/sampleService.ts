import type { SampleItem } from '../types';

const ITEM_COUNT = 50;
// Long enough for the loading state to be visible.
const LATENCY_MS = 600;

const ITEMS: SampleItem[] = Array.from({ length: ITEM_COUNT }, (_, index) => {
  const number = index + 1;
  return {
    id: String(number),
    title: `Sample item ${number}`,
    description: `Item ${number} of ${ITEM_COUNT} from the mock service.`,
  };
});

/**
 * Stand-in for a network request; swap in the fetch version below once a real
 * API exists.
 */
export function fetchSampleItems(): Promise<SampleItem[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(ITEMS), LATENCY_MS);
  });
}

// fetch version, written against a demo API (jsonplaceholder); adjust API_URL
// and PostDto to the real API. Keep the `fetchSampleItems` name and return type
// so `useSampleItems` needs no changes. fetch only rejects on network failure,
// so 4xx/5xx responses have to be turned into errors by hand.
//
// const API_URL = 'https://jsonplaceholder.typicode.com/posts';
//
// type PostDto = {
//   id: number;
//   userId: number;
//   title: string;
//   body: string;
// };
//
// export async function fetchSampleItems(): Promise<SampleItem[]> {
//   const response = await fetch(API_URL, {
//     headers: { Accept: 'application/json' },
//   });
//   if (!response.ok) {
//     throw new Error(`Request failed with status ${response.status}`);
//   }
//   const posts: PostDto[] = await response.json();
//   return posts.map(post => ({
//     id: String(post.id),
//     title: post.title,
//     description: post.body,
//   }));
// }
//
// export async function createSampleItem(
//   input: Omit<SampleItem, 'id'>,
// ): Promise<SampleItem> {
//   const response = await fetch(API_URL, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ title: input.title, body: input.description }),
//   });
//   if (!response.ok) {
//     throw new Error(`Request failed with status ${response.status}`);
//   }
//   const post: PostDto = await response.json();
//   return { id: String(post.id), title: post.title, description: post.body };
// }
