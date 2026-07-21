"use client";

export default function PosterPreview({
  eyebrow,
  eventName,
  day,
  rest,
  location,
  description,
}) {
  const nameForPoster = (eventName || "Untitled Event").toUpperCase();

  return (
    <div className="preview-wrap">
      <div className="poster-card">
        <p className="poster-eyebrow">{eyebrow}</p>
        <h2 className="poster-name">{nameForPoster}</h2>

        <div className="poster-date-row">
          <span className="poster-day">{day === "TBD" ? "DATE TBD" : day}</span>
          <span className="poster-date-rest">{rest}</span>
        </div>
        <p className="poster-location">{(location || "LOCATION TBA").toUpperCase()}</p>

        <p className="poster-description">{description}</p>

        <div className="poster-footer">
          <span>ADMIT ONE</span>
          <span>POSTER GENERATED</span>
        </div>
      </div>
      <p className="preview-caption">
        Preview scales to fit — download renders a 1080×1620 PNG.
      </p>
    </div>
  );
}
