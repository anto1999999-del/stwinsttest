import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="product-skeleton">
      {/* Image placeholder */}
      <div className="skeleton-image-container"></div>

      {/* Content */}
      <div className="skeleton-content">
        {/* Title lines */}
        <div className="skeleton-title skeleton-title-long"></div>
        <div className="skeleton-title skeleton-title-short"></div>

        {/* Description lines */}
        <div className="skeleton-description skeleton-description-line1"></div>
        <div className="skeleton-description skeleton-description-line2"></div>
        <div className="skeleton-description skeleton-description-line3"></div>

        {/* Price and badge */}
        <div className="skeleton-price-container">
          <div className="skeleton-price"></div>
          <div className="skeleton-badge"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
