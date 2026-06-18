import { getRelatedProperties } from "../../../../../data/estateProperties";
import EstatePropertyCarousel from "../../shared/EstatePropertyCarousel";

type RelatedPropertiesCarouselProps = {
  currentPropertyId: string;
};

const RelatedPropertiesCarousel = ({
  currentPropertyId,
}: RelatedPropertiesCarouselProps) => {
  const carouselProperties = getRelatedProperties(currentPropertyId);

  return (
    <EstatePropertyCarousel
      properties={carouselProperties}
      title="Explore More Properties"
    />
  );
};

export default RelatedPropertiesCarousel;
