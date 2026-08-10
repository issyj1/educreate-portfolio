import { useParams } from "react-router-dom";
import { useState } from "react";
import { galleries } from "../data/galleries";
import Lightbox from "../components/Lightbox";

export default function GalleryPage() {

  const { galleryId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const images = galleries[galleryId];

  if (!images) {
    return <h2>Gallery not found</h2>;
  }

  return (
    <>
      <div className="gallery-grid">

        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.title}
            onClick={() => setSelectedImage(img)}
          />
        ))}

      </div>

      <Lightbox
        image={selectedImage}
        close={() => setSelectedImage(null)}
      />
    </>
  );
}