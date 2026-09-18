import { useState } from "react";
import type { DishwashingPhotoCollection } from "./dishwashingImages";

export function DishwashingImageGallery({ collection }: { collection: DishwashingPhotoCollection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePhoto = collection.photos[activeIndex];

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + collection.photos.length) % collection.photos.length);
  };

  return (
    <figure className="dw-original-gallery" aria-label={`${collection.title} original photo gallery`}>
      <div className="dw-original-gallery-stage">
        <img src={activePhoto.src} alt={activePhoto.alt} width="1448" height="1086" />
        {collection.photos.length > 1 && (
          <>
            <button type="button" className="dw-original-gallery-prev" aria-label="Previous original equipment photo" onClick={() => move(-1)}>←</button>
            <button type="button" className="dw-original-gallery-next" aria-label="Next original equipment photo" onClick={() => move(1)}>→</button>
          </>
        )}
        <span>{activeIndex + 1} / {collection.photos.length}</span>
      </div>
      <figcaption>
        <strong>{activePhoto.caption}</strong>
        <small>{collection.sourceLabel}. {collection.fitNote}</small>
      </figcaption>
      <div className="dw-original-gallery-thumbs" aria-label="Choose an original equipment photo">
        {collection.photos.map((item, index) => (
          <button
            type="button"
            key={item.src}
            className={index === activeIndex ? "is-active" : undefined}
            aria-label={`Show photo ${index + 1}: ${item.caption}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
          >
            <img src={item.src} alt="" width="160" height="120" loading="lazy" />
          </button>
        ))}
      </div>
    </figure>
  );
}
