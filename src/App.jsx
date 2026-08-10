import Footer from "./components/Footer";
import ThumbnailGrid from "./components/ThumbnailGrid";
import Lightbox from "./components/Lightbox";

import { educateImages } from "./data/educateimages";
import { featuredImages } from "./data/featuredimages";
import { staffPortraits } from "./data/staffportraits";
import CustomCursor from "./components/CustomCursor";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function App() {
  const [lightboxImages, setLightboxImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);


useEffect(() => {
  gsap.from(".educreate-title", {
    opacity: 0,
    y: 225,
    duration: 1.4,
    ease: "power3.out",
  });

  
}, []);

  useEffect(() => {
    gsap.from(".thumbnail-image", {
      opacity: 0,
      y: 60,
      stagger: 0.15,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex === null) return;

      if (e.key === "Escape") {
        setCurrentIndex(null);
      }

      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) =>
          prev === lightboxImages.length - 1 ? 0 : prev + 1
        );
      }

      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) =>
          prev === 0 ? lightboxImages.length - 1 : prev - 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, lightboxImages]);

  const openLightbox = (images, index) => {
    setLightboxImages(images);
    setCurrentIndex(index);
  };

  return (
    <>
        <CustomCursor />

      <main>

      <section className="hero">
      <h2 className="educreate-title">Educreate</h2>
        <p>
    Creative services for education companies. Explore latest work
  </p>
</section>

        <section className="photography">
          <h2>Photography</h2>

          <ThumbnailGrid
            images={featuredImages}
            onImageClick={(index) =>
              openLightbox(featuredImages, index)
            }
          />
        </section>

        <section className="photography">
          <h2>Ads</h2>

          <ThumbnailGrid
            images={educateImages}
            onImageClick={(index) =>
              openLightbox(educateImages, index)
            }
          />
        </section>

        <section className="photography">
          <h2>School Portraits</h2>
          <ThumbnailGrid
            images={staffPortraits}
            onImageClick={(index) =>
              openLightbox(staffPortraits, index)
            }
          />
        </section>


        <section className="photography">
          <h2>Staff Portraits</h2>
          <ThumbnailGrid images={[]} />
        </section>
      </main>

      <Footer />

      <Lightbox
        images={lightboxImages}
        currentIndex={currentIndex}
        close={() => setCurrentIndex(null)}
        setCurrentIndex={setCurrentIndex}
      />
    </>
  );
}