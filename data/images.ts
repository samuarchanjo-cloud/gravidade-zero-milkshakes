/**
 * URLs centralizadas de imagens da loja.
 * Edite aqui quando trocar fotos — products.ts e settings.ts usam estas constantes.
 */

export const PLACEHOLDER_PRODUCT =
  "https://placehold.co/800x800/png?text=Milkshake";

export const storeImages = {
  logo: "https://instasize.com/p/e204d36e3002c4beb3cf26e5d8690962ce5f95c1780784b594b7608d7ac49ce4",
  banner:
    "https://res.cloudinary.com/ddc8f5ani/image/upload/f_auto,q_auto/ChatGPT_Image_25_de_mai._de_2026_12_31_11_ek9efq",
  products: {
    marte: "https://instasize.com/p/74059d6e6f562be61af401d6da0fe1850658489a9bc15d7f06dbc4c0190bb945",
    netuno:
      "https://instasize.com/p/b432abdfcba62bccf0023ad361c95c0c9b4772718b6986a29acbd1ba6a76f96c",
    "via-lactea":
      "https://instasize.com/p/3d55753ef0f9338c6a150e179d95062b78ba94658964ee33c1bd60216cfba685",
    eclipse:
      "https://instasize.com/p/0ec4c7d2bf9435d3b24f6e5bbb996b8837ff061d20e69181fd401004685234a1",
    "meteoro-crocante":
      "https://instasize.com/p/75787b27473a523e73a432a4a7824ccba5dc9fe0fe75d4616c5ab336353968ae",
    jupiter:
      "https://instasize.com/p/54d1f123c5418532fa4fdbc68b5ce26774e68481645ef86446ab94a0bc09f79c",
    saturno:
      "https://instasize.com/p/1d35e4d4d1ac7bc8dcbfa0970f6e75970b4d5454f6dc1abef6cf1b85b4623910",
    plutao:
      "https://instasize.com/p/dba2d82def204994d37f598ee88a1b404cdea3eaa85958e591f54f9b5eaefcb0",
    "area-51":
      "https://instasize.com/p/8286505db2553ee7feea7ab8c5a4d676d4d393aa870e72edb9992822b9d55584",
    "materia-escura":
      "https://instasize.com/p/d8570c6140c61daf4146c4804b8b31b8e99117524b356050a5d210c7367616f5",
  },
} as const;

export type ProductImageId = keyof typeof storeImages.products;

export function getProductImage(id: string): string {
  const url = storeImages.products[id as ProductImageId];
  return url?.trim() || PLACEHOLDER_PRODUCT;
}
