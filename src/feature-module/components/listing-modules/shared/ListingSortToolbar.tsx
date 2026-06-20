import CommonSelect from "../../../../core/common/common-select/commonSelect";
import { Price_Range, Sort_By } from "../../../../core/common/selectOption";
import type {
  ListingPriceRange,
  ListingSortBy,
} from "../../../../utils/propertyListingSort";

type ListingSortToolbarProps = {
  sortBy: ListingSortBy;
  priceRange: ListingPriceRange;
  onSortByChange: (value: ListingSortBy) => void;
  onPriceRangeChange: (value: ListingPriceRange) => void;
};

const ListingSortToolbar = ({
  sortBy,
  priceRange,
  onSortByChange,
  onPriceRangeChange,
}: ListingSortToolbarProps) => (
  <>
    <div className="result-list d-flex d-block flex-lg-row flex-md-row flex-column align-items-center gap-2">
      <h5>Sort By</h5>
      <div className="result-select">
        <CommonSelect
          options={Sort_By}
          className="select"
          value={Sort_By.find((option) => option.value === sortBy)}
          onChange={(option) =>
            onSortByChange((option?.value as ListingSortBy) ?? "Default")
          }
        />
      </div>
    </div>
    <div className="result-list d-flex flex-lg-row flex-md-row flex-column align-items-center gap-2">
      <h5>Price Range</h5>
      <div className="result-select">
        <CommonSelect
          options={Price_Range}
          className="select"
          value={Price_Range.find((option) => option.value === priceRange)}
          onChange={(option) =>
            onPriceRangeChange(
              (option?.value as ListingPriceRange) ?? "Low to High",
            )
          }
        />
      </div>
    </div>
  </>
);

export default ListingSortToolbar;
