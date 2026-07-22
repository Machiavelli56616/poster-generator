"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const [mode, setMode] = useState("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (mode === "sign_up") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <p className="eyebrow">POSTER SHOP</p>
      <h1 className="title">{mode === "sign_up" ? "Create an account" : "Sign in"}</h1>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <button
          className="btn btn-generate"
          type="submit"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Please wait…" : mode === "sign_up" ? "Sign up" : "Sign in"}
        </button>
      </form>
      {message && <p className="status-note">{message}</p>}
      <button
        className="link-btn"
        onClick={() => setMode(mode === "sign_up" ? "sign_in" : "sign_up")}
      >
        {mode === "sign_up" ? "Already have an account? Sign in" : "Need an account? Sign up"}
      </button>
    </div>
  );
    }
