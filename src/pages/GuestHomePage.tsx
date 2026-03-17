import { BrandSection } from "../features/brand-details"
import { Carousel } from "../features/carousel"
import { useBrands } from "../hooks/useBrands"

const GuestHomePage = () => {
  const { data: brands, isLoading, error } = useBrands()
  const activeBrands = brands ? brands.filter(b => b.isActive) : [];

  if (isLoading) return null
  if (error) return null

  return (
    <>
      <Carousel />
      {activeBrands &&
        activeBrands.map((brand, idx) => {
          const isProjectZero = brand.brandName.toLowerCase().includes('project zero');
          // remove leading/trailing slashes from route
          const cleanRoute = brand.route.replace(/^\/+|\/+$/g, '');
          const storyLink = isProjectZero
            ? '/guest/project-zero-story'
            : `/guest/${cleanRoute}-story`;

          return (
            <BrandSection
              key={brand.id}
              name={brand.brandName}
              description={brand.description}
              image={brand.url}
              shopLink={`/guest/shop?collection=${encodeURIComponent(brand.brandName)}`}
              storyLink={storyLink}
              imagePosition={idx % 2 === 0 ? 'left' : 'right'}
            />
          );
        })}
    </>
  )
}

export default GuestHomePage
