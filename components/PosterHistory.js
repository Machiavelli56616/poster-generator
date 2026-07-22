"use client";

export default function PosterHistory({ posters, onSelect }) {
  if (!posters.length) return null;
  return (
    <div className="history">
      <p className="field-label">Your past posters</p>
      <ul className="history-list">
        {posters.map((p) => (
          <li key={p.id}>
            <button className="history-item" onClick={() => onSelect(p)}>
              <span className="history-name">{p.event_name}</span>
              <span className="history-date">
                {new Date(p.created_at).toLocaleDateString()}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
