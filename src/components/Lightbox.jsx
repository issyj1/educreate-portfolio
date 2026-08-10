import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Lightbox({
  images,
  currentIndex,
  close,
  setCurrentIndex,
}) {
  const lightboxRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (currentIndex === null) return;

    const tl = gsap.timeline();

    tl.fromTo(
      lightboxRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      }
    );

    tl.fromTo(
      imageRef.current,
      {
        opacity: 0,
        scale: 0.94,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.2"
    );

    tl.fromTo(
      ".lightbox-control",
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.4"
    );
  }, [currentIndex]);

  if (currentIndex === null || !images.length) {
    return null;
  }

  const image = images[currentIndex];

  const previousImage = (e) => {
    e.stopPropagation();

    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = (e) => {
    e.stopPropagation();

    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div
      ref={lightboxRef}
      className="lightbox"
      onClick={close}
    >
      <button
        className="lightbox-control lightbox-close"
        onClick={close}
        aria-label="Close"
      >
        ×
      </button>

      <button
        className="lightbox-control lightbox-prev"
        onClick={previousImage}
        aria-label="Previous image"
      >
        ←
      </button>

      <img
        ref={imageRef}
        className="lightbox-image"
        src={image.src}
        alt={image.title}
        onClick={(e) => e.stopPropagation()}
      />

      <button
        className="lightbox-control lightbox-next"
        onClick={nextImage}
        aria-label="Next image"
      >
        →
      </button>
    </div>
  );
}