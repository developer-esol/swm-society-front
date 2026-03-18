import type { Brand } from '../../types';
import { apiClient } from '../apiClient';

export const brandService = {
  // READ operations
  async getBrands(): Promise<Brand[]> {
    try {
      // Try to get brands from API
      const data = await apiClient.get<any>('/brands?page=1&limit=10');
      const brands = Array.isArray(data) ? data : data.brands || [];
      
      // Transform backend response to match Brand interface
      const transformedBrands = brands.map((brand: any) => {
        // Hardcoded image URLs for specific brands
        let imageUrl = '';
        const brandName = brand.brandName || brand.name || brand.brand_name || '';
        
        if (brandName.toLowerCase().includes('project zero') || brandName.toLowerCase().includes('project zeros')) {
          imageUrl = 'https://res.cloudinary.com/dmjacs0c9/image/upload/v1768294993/d4_bfcxcd.jpg'; // Project ZerO's red collection image
        } else if (brandName.toLowerCase().includes('hear my voice') || brandName.toLowerCase().includes('hmv')) {
          imageUrl = 'https://res.cloudinary.com/dmjacs0c9/image/upload/v1768294940/b3_copy_elzd6c.jpg'; // Denim collection image  
        } else if (brandName.toLowerCase().includes('thomas mushet') || brandName.toLowerCase().includes('thomas')) {
          imageUrl = 'https://res.cloudinary.com/dmjacs0c9/image/upload/v1768294900/B2_copy_zlgtot.webp'; // Basketball/sports collection image
        } else {
          imageUrl = brand.url || brand.imageUrl || 'https://res.cloudinary.com/dmjacs0c9/image/upload/v1768294857/SWM3_ko58b3.jpg'; // Fallback image
        }

        return {
          id: brand.id?.toString() || brand._id?.toString(),
          name: brandName || 'Unknown Brand',
          brandName: brandName || 'Unknown Brand',
          description: brand.description || '',
          url: imageUrl,
          isActive: brand.isActive ?? brand.is_active ?? true,
          route: brand.route || `/${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
        };
      });
      return transformedBrands;
    } catch (error) {
      console.warn('API unavailable, using temporary demo data:', error);
      // Return demo data if API is unavailable so you can see the dropdown working
      return [
        {
          id: "1",
          name: "Nike",
          brandName: "Nike",
          description: "Just Do It",
          url: "/nike.jpg",
          isActive: true,
          route: "/nike"
        },
      ];
    }
  },
};