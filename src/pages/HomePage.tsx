import { BrandSection } from "../features/brand-details"
import { Carousel } from "../features/carousel"
import { useBrands } from "../hooks/useBrands"

const HomePage = () => {
  const { data: brands, isLoading, error } = useBrands()
  const activeBrands = brands ? brands.filter(b => b.isActive) : [];

  if (isLoading) return null
  if (error) return null

  return (
    <>
      <Carousel />
      {activeBrands &&
        activeBrands.map((brand, idx) => {
          const name = brand.brandName || '';
          const image = brand.url || '';
          const lowerName = name.toLowerCase();
          const cleanRoute = (brand.route || '').replace(/^\/+|\/+$/g, '');

          // Explicit mappings for known brand pages
          const storyLink = lowerName.includes('project zero')
            ? '/project-zero-story'
            : lowerName.includes('hear my voice')
              ? '/hear-my-voice-story'
              : lowerName.includes('thomas mushet')
                ? '/thomas-mushet-story'
                : `/${cleanRoute}-story`;

          return (
            <BrandSection
              key={brand.id}
              name={name}
              description={brand.description || ''}
              image={image}
              shopLink={`/shop?collection=${encodeURIComponent(name)}`}
              storyLink={storyLink}
              imagePosition={idx % 2 === 0 ? 'left' : 'right'}
            />
          );
        })}
    </>
  );
}

export default HomePage