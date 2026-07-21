export const EYEBROWS = [
  "YOU'RE INVITED",
  "SAVE THE DATE",
  "LIVE & IN PERSON",
  "DOORS OPEN SOON",
  "MARK YOUR CALENDAR",
];

export function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function formatDate(dateStr) {
  if (!dateStr) return { day: "TBD", rest: "DATE TO BE ANNOUNCED" };
  const d = new Date(dateStr + "T12:00:00");
  if (isNaN(d)) return { day: "TBD", rest: dateStr.toUpperCase() };
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  return { day: String(day), rest: `${weekday} \u00b7 ${month} \u00b7 ${year}` };
}

function wrapCanvasText(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const w of words) {
    const test = current ? current + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Draws the poster to an offscreen canvas and triggers a PNG download.
export async function downloadPosterPng({
  eventName,
  description,
  location,
  day,
  rest,
  eyebrow,
}) {
  if (document.fonts) {
    await Promise.all([
      document.fonts.load("400px 'Bebas Neue'"),
      document.fonts.load("700 32px 'Space Grotesk'"),
      document.fonts.load("500 24px 'JetBrains Mono'"),
    ]);
  }

  const INK = "#15171c";
  const PAPER = "#ede6d6";
  const AMBER = "#f2a93b";
  const TEAL = "#2e8b8b";

  const W = 1080;
  const H = 1620;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);

  const margin = 56;
  ctx.strokeStyle = "rgba(237,230,214,0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);

  const padX = margin + 48;
  let cursorY = margin + 110;

  ctx.fillStyle = TEAL;
  ctx.font = "500 30px 'JetBrains Mono'";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(eyebrow, padX, cursorY);

  cursorY += 70;

  const nameForPoster = (eventName || "Untitled Event").toUpperCase();
  ctx.fillStyle = PAPER;
  ctx.font = "120px 'Bebas Neue'";
  const nameLines = wrapCanvasText(ctx, nameForPoster, W - padX * 2);
  for (const line of nameLines.slice(0, 4)) {
    cursorY += 108;
    ctx.fillText(line, padX, cursorY);
  }

  cursorY += 70;

  ctx.fillStyle = AMBER;
  ctx.font = "56px 'Bebas Neue'";
  const dayLabel = day === "TBD" ? "DATE TBD" : day;
  ctx.fillText(dayLabel, padX, cursorY);
  const dayWidth = ctx.measureText(dayLabel).width;

  ctx.fillStyle = PAPER;
  ctx.font = "500 26px 'JetBrains Mono'";
  ctx.fillText(rest, padX + dayWidth + 28, cursorY - 4);

  cursorY += 48;
  ctx.fillStyle = "rgba(237,230,214,0.85)";
  ctx.font = "500 30px 'Space Grotesk'";
  ctx.fillText((location || "LOCATION TBA").toUpperCase(), padX, cursorY);

  cursorY += 60;

  ctx.fillStyle = "rgba(237,230,214,0.75)";
  ctx.font = "400 30px 'Space Grotesk'";
  const descLines = wrapCanvasText(ctx, description || "", W - padX * 2);
  for (const line of descLines.slice(0, 5)) {
    cursorY += 42;
    ctx.fillText(line, padX, cursorY);
  }

  const perfY = H - margin - 150;
  ctx.strokeStyle = "rgba(237,230,214,0.4)";
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 14]);
  ctx.beginPath();
  ctx.moveTo(margin, perfY);
  ctx.lineTo(W - margin, perfY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = PAPER;
  [margin, W - margin].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, perfY, 18, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(237,230,214,0.55)";
  ctx.font = "500 24px 'JetBrains Mono'";
  ctx.fillText("ADMIT ONE", padX, H - margin - 80);
  ctx.textAlign = "right";
  ctx.fillText("POSTER GENERATED", W - padX, H - margin - 80);
  ctx.textAlign = "left";

  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `${(eventName || "poster").toLowerCase().replace(/\s+/g, "-")}.png`;
  link.href = dataUrl;
  link.click();
}
