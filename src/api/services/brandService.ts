import type { Brand } from '../../types';
import { apiClient } from '../apiClient';

export const brandService = {
  // READ operations
  async getBrands(): Promise<Brand[]> {
    // return apiClient.get<Brand[]>('/brands');

    return [
      {
        id: "1",
        brandName: "Project ZerO's",
        description: "SWMSOCIETY is proud to have designed and curated Project ZerO's, a transition project that aligns perfectly with our Style With Meaning philosophy—where fashion is not just about what you wear, but about the message it carries and the impact it creates.",
        url: "/thumbnail.jpg",
        isActive: true,
        route: "/project-zero"
      },
      {
        id: "2",
        brandName: "Thomas Mushet",
        description: "The Thomas Mushet collection represents the perfect blend of urban style and athletic inspiration. Designed for those who appreciate quality craftsmanship and contemporary aesthetics.",
        url: "/B2.webp",
        isActive: true,
        route: "/thomas-mushet"
      },
      {
        id: "3",
        brandName: "Hear My Voice",
        description: "The Hear My Voice collection is more than fashion—it's a statement. Each piece is crafted to represent authenticity and self-expression, giving a platform to those whose voices need to be heard.",
        url: "/b3.jpg",
        isActive: true,
        route: "/hear-my-voice"
      },
    ];
  },
};