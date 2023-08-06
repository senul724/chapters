/**
 * Get the URL depending on where you live
 */
export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

type StringKeys<T> = {
  [k in keyof T]: T[k] extends string ? k : never;
}[keyof T];

type OnlyString<T> = { [k in StringKeys<T>]: string };

/**
 * Get the index of an array of object contaning a specific value of an object
 */
export const getIndex = <T extends OnlyString<T>>(
  array: T[],
  key: StringKeys<T>,
  value: string | number,
): number => {
  return array.findIndex((array) => array[key] === value);
};

/**
 * Seperate tailwind utility classes with ease
 */
export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}
