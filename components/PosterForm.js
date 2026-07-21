"use client";

export default function PosterForm({
  eventName,
  setEventName,
  date,
  setDate,
  location,
  setLocation,
  description,
  setDescription,
  onGenerate,
  onDownload,
  downloading,
  justGenerated,
}) {
  return (
    <div>
      <label className="field">
        <span className="field-label">Event name</span>
        <input
          className="input"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Night Market"
        />
      </label>

      <label className="field">
        <span className="field-label">Date</span>
        <input
          className="input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field-label">Location</span>
        <input
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Union Square, San Francisco"
        />
      </label>

      <label className="field">
        <span className="field-label">Description</span>
        <textarea
          className="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short line about what to expect..."
        />
      </label>

      <div className="button-row">
        <button className="btn btn-generate" onClick={onGenerate}>
          Generate poster copy
        </button>
        <button className="btn btn-download" onClick={onDownload} disabled={downloading}>
          {downloading ? "Preparing…" : "Download PNG"}
        </button>
      </div>

      {justGenerated && (
        <p className="status-note">Poster copy updated — check the preview</p>
      )}
    </div>
  );
            }
