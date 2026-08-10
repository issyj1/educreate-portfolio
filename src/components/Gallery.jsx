import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

function toTitleCase(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}


function cleanSegment(segment) {
  return segment.replace(/\.[^/.]+$/, "");
}




export default function Gallery({ images, galleryId }) {

  

  const navigate = useNavigate();
  const { imageId } = useParams();
  const location = useLocation();

  const parts = location.pathname
  .split("/")
  .filter(Boolean)
  .map(cleanSegment)
  .map(toTitleCase);

  const [view, setView] = useState("thumbs");
  const [index, setIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  // ✨ TOOLTIP STATE
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
  });

  const thumbRefs = useRef([]);
  const isFirstRender = useRef(true);
  const justOpened = useRef(true);
  const directionRef = useRef(1);

  // 🔁 Sync URL → state
  useEffect(() => {
    if (imageId && images.length) {
      const foundIndex = images.findIndex((img) => {
        const name = img
          .split("/")
          .pop()
          .replace(/\.[^/.]+$/, "");

        return name === imageId;
      });

      if (foundIndex !== -1) {
        setIndex(foundIndex);
        setView("slideshow");
      }
    } else {
      setView("thumbs");
    }
  }, [imageId, images]);

  // 👉 Open slideshow
  const openSlide = (i) => {
    setIndex(i);
    setView("slideshow");

    justOpened.current = true;

    const imageName = images[i]
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "");

    navigate(`/gallery/${galleryId}/${imageName}`);
  };

  // 👉 Next image
  const next = (e) => {
    e.stopPropagation();

    directionRef.current = 1;

    const newIndex = (index + 1) % images.length;

    updateURL(newIndex);
  };

  // 👉 Previous image
  const prev = (e) => {
    e.stopPropagation();

    directionRef.current = -1;

    const newIndex =
      (index - 1 + images.length) % images.length;

    updateURL(newIndex);
  };

  // 🔁 URL sync
  const updateURL = (i) => {
    const imageName = images[i]
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "");

    setIndex(i);

    navigate(`/gallery/${galleryId}/${imageName}`);
  };

  // 👉 Close slideshow
  const close = () => {
    setView("thumbs");

    navigate(`/gallery/${galleryId}`);

    setTimeout(() => {
      thumbRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  // ✨ STYLED TOOLTIP TEXT
  const renderStyledParts = (parts) => {
    return parts.map((part, index) => (
      <span
        key={index}
        className={
          index === 1
            ? "second-word"
            : index === 2
            ? "third-word"
            : ""
        }
      >
        {part}
        {index < parts.length - 1 && " / "}
      </span>
    ));
  };

 
  return (
    
    <div>
      {/* THUMBNAILS */}
      {view === "thumbs" && (
        <div className="container2">
          {images.map((img, i) => (
            <img
  key={i}
  ref={(el) => (thumbRefs.current[i] = el)}
  src={img}
  onLoad={() =>
    setLoadedImages((prev) => ({
      ...prev,
      [img]: true,
    }))
  }
              onClick={() => openSlide(i)}
              style={{
                cursor: "pointer",
                width: "100%",
                opacity: loadedImages[img] ? 1 : 0,
                transition: "opacity 0.6s ease",
              }}
              alt=""
              
            />
            
          ))}
        </div>
      )}

      {/* SLIDESHOW */}
      {view === "slideshow" && (
        <div
          className="slideshow-overlay"
          onClick={close}
        >
          {/* IMAGE WRAPPER */}
          <div
            className="image-wrapper"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={(e) =>
              setMousePos({
                x: e.pageX,
                y: e.pageY,
              })
            }
          >
            {/* IMAGE */}
            <AnimatePresence mode="wait">
              <motion.img
                key={images[index]}
                src={images[index]}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              />
            </AnimatePresence>

            {/* ✨ HOVER TOOLTIP */}
            <motion.div
  className="hover-tooltip"
  style={{
    left: mousePos.x + 1,
    top: mousePos.y + 1,
    opacity: hovered ? 1 : 0,
    visibility: hovered ? "visible" : "hidden",
    pointerEvents: "none",
  }}
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }}
>
{parts.map((part, index) => (
  <motion.div
  key={index}
  initial={{
    opacity: 0,
    y: 10,
    scale: 0.8,
  }}
  animate={{
    opacity: hovered ? 1 : 0,
    y: hovered ? 0 : 10,
    scale: hovered ? 1 : 0.8,
  }}
  transition={{
    delay: index * 0.15,
    duration: 0.35,
    ease: "easeOut",
  }}
  style={{
    marginLeft: `${index * 24}px`,
    position: "relative",
  }}
  className={`tooltip-word ${
    index === 1
      ? "second-word"
      : index === 2
      ? "third-word"
      : ""
  }`}
>
  {part}

  {/* connector */}
  {index > 0 && (
    <span className="tooltip-line" />
  )}
</motion.div>
))}

 
</motion.div>
  
          </div>

          {/* BUTTONS */}
          <button
            className="prev-btn"
            onClick={prev}
          >
            Prev
          </button>

          <button
            className="next-btn"
            onClick={next}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}