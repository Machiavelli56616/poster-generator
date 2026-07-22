"use client";

import { useState, useEffect, useCallback } from "react";
import PosterForm from "@/components/PosterForm";
import PosterPreview from "@/components/PosterPreview";
import AuthForm from "@/components/AuthForm";
import PosterHistory from "@/components/PosterHistory";
import { supabase } from "@/lib/supabase";
import { EYEBROWS, hashStr, formatDate, downloadPosterPng } from "@/lib/poster-utils";

export default function Home() {
  const [session, setSession] = useState(undefined);
  const [eventName, setEventName] = useState("Night Market");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("Union Square, San Francisco");
  const [description, setDescription] = useState(
    "An evening of local food stalls, live music, and handmade goods."
  );
  const [eyebrow, setEyebrow] = useState(EYEBROWS[0]);
  const [justGenerated, setJustGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadPosters = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from("posters")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error) setPosters(data);
  }, []);

  useEffect(() => {
    if (session?.user) loadPosters(session.user.id);
  }, [session, loadPosters]);

  const handleGenerate = useCallback(async () => {
    const seed = hashStr(eventName || "event");
    const nextEyebrow = EYEBROWS[seed % EYEBROWS.length];
    setEyebrow(nextEyebrow);
    let nextDescription = description;
    if (!description.trim()) {
      nextDescription = `Join us for ${eventName || "this event"}. Details to follow — stay tuned.`;
      setDescription(nextDescription);
    }
    setJustGenerated(true);

    if (session?.user) {
      setSaving(true);
      const { error } = await supabase.from("posters").insert({
        user_id: session.user.id,
        event_name: eventName,
        date: date || null,
        location,
        description: nextDescription,
        eyebrow: nextEyebrow,
      });
      setSaving(false);
      if (!error) loadPosters(session.user.id);
    }
  }, [eventName, description, date, location, session, loadPosters]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const { day, rest } = formatDate(date);
      await downloadPosterPng({ eventName, description, location, day, rest, eyebrow });
    } finally {
      setDownloading(false);
    }
  }, [eventName, description, location, date, eyebrow]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setPosters([]);
  };

  const handleSelectPoster = (p) => {
    setEventName(p.event_name);
    setDate(p.date || "");
    setLocation(p.location);
    setDescription(p.description);
    setEyebrow(p.eyebrow);
    setJustGenerated(false);
  };

  const { day, rest } = formatDate(date);

  if (session === undefined) {
    return (
      <main className="page">
        <p className="subtitle">Loading…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="page">
        <AuthForm />
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header-row">
        <div>
          <p className="eyebrow">POSTER SHOP</p>
          <h1 className="title">Make your event poster</h1>
          <p className="subtitle">Signed in as {session.user.email}</p>
        </div>
        <button className="link-btn" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      <div className="layout">
        <div>
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
          {saving && <p className="status-note">Saving to your history…</p>}
          <PosterHistory posters={posters} onSelect={handleSelectPoster} />
        </div>
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
