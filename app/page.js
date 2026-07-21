"use client";

import { useState, useCallback } from "react";
import PosterForm from "@/components/PosterForm";
import PosterPreview from "@/components/PosterPreview";
import { EYEBROWS, hashStr, formatDate, downloadPosterPng } from "@/lib/poster-utils";

export default function Home() {
  const [eventName, setEventName] = useState("Night Market");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("Union Square, San Francisco");
  const [description, setDescription] = useState(
    "An evening of local food stalls, live music, and handmade goods."
  );
  const [eyebrow, setEyebrow] = useState(EYEBROWS[0]);
  const [justGenerated, setJustGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleGenerate = useCallback(() => {
    const seed = hashStr(eventName || "event");
    setEyebrow(EYEBROWS[seed % EYEBROWS.length]);
    if (!description.trim()) {
      setDescription(`Join us for ${eventName || "this event"}. Details to follow — stay tuned.`);
    }
    setJustGenerated(true);
  }, [eventName, description]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const { day, rest } = formatDate(date);
      await downloadPosterPng({
        eventName,
        description,
        location,
        day,
        rest,
        eyebrow,
      });
    } finally {
      setDownloading(false);
    }
  }, [eventName, description, location, date, eyebrow]);

  const { day, rest } = formatDate(date);

  return (
    <main className="page">
      <header>
        <p className="eyebrow">POSTER SHOP</p>
        <h1 className="title">Make your event poster</h1>
        <p className="subtitle">
          Fill in the details, generate the copy, and download a print-ready poster.
        </p>
      </header>

      <div className="layout">
        <PosterForm
          eventName={eventName}
          setEventName={(v) => {
            setEventName(v);
            setJustGenerated(false);
          }}
          date={date}
          setDate={(v) => {
            setDate(v);
            setJustGenerated(false);
          }}
          location={location}
          setLocation={(v) => {
            setLocation(v);
            setJustGenerated(false);
          }}
          description={description}
          setDescription={(v) => {
            setDescription(v);
            setJustGenerated(false);
          }}
          onGenerate={handleGenerate}
          onDownload={handleDownload}
          downloading={downloading}
          justGenerated={justGenerated}
        />
        <PosterPreview
          eyebrow={eyebrow}
          eventName={eventName}
          day={day}
          rest={rest}
          location={location}
          description={description}
        />
      </div>
    </main>
  );
    }
