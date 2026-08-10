import { useLocation } from "react-router-dom";

function cleanSegment(segment) {
  return segment.replace(/\.[^/.]+$/, "");
}

function toTitleCase(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Footer() {
  const location = useLocation();

  const parts = location.pathname
    .split("/")
    .filter(Boolean)
    .map(cleanSegment)
    .map(toTitleCase);

    return (
      <div className="footer">
        {parts.map((part, index) => (
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
        ))}{" "}
        &#9733;
      </div>
    );
}