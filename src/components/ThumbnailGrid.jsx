export default function ThumbnailGrid({
  images = [],
  onImageClick,
}) {
  return (
    <div className="thumbnail-grid">
      {images.map((img, i) => (
        <button
          className="thumbnail"
          key={i}
          onClick={() => onImageClick(i)}
        >
          <img
            className="thumbnail-image"
            src={img.src}
            alt={img.title}
          />
        </button>
      ))}
    </div>
  );
}