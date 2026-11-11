"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56 }}>
        <form onSubmit={onSubmit}>
          <div className="row">
            <div><label>Name</label><input name="name" required /></div>
            <div><label>Company</label><input name="company" required /></div>
          </div>
          <div className="row">
            <div><label>Email</label><input name="email" type="email" required /></div>
            <div><label>Country</label><input name="country" /></div>
          </div>
          <div className="row">
            <div>
              <label>Product</label>
              <select name="product" defaultValue="Prepainted aluminum coil">
                <option>Prepainted aluminum coil</option>
                <option>Rolled aluminum coil</option>
                <option>Prepainted steel coil</option>
                <option>Stucco / embossed</option>
                <option>Slitting / cut-to-length</option>
              </select>
            </div>
            <div>
              <label>Coating system</label>
              <select name="coating" defaultValue="Not sure">
                <option>PVDF</option>
                <option>PUPA</option>
                <option>HDPE</option>
                <option>PE</option>
                <option>Not sure</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div><label>Thickness (mm)</label><input name="thickness" /></div>
            <div><label>Width (mm)</label><input name="width" /></div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Message</label>
            <textarea name="message" />
          </div>
          <button className="btn btn-p" type="submit" disabled={status === "sending"} style={{ border: 0, cursor: "pointer" }}>
            {status === "sending" ? "Sending..." : "Send request"}
          </button>
          {status === "sent" && (
            <p style={{ marginTop: 16, color: "var(--ink)" }}>
              Thank you. Our sales team will reply shortly.
            </p>
          )}
          {status === "error" && (
            <p style={{ marginTop: 16, color: "#b00020" }}>{message}</p>
          )}
        </form>
        <div className="panel">
          <h3>Sales</h3>
          <p style={{ color: "var(--steel)", marginBottom: 20 }}>
            Director of Sales<br />
            Email: sales@orbitaluminum.com<br />
            Phone: [number]
          </p>
          <h3>Plant</h3>
          <p style={{ color: "var(--steel)" }}>
            Aqaba, Jordan<br />
            [Street address]
          </p>
        </div>
      </div>
    </section>
  );
}
