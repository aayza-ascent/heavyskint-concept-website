import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Booking and press enquiries for Heavyskint.",
};

/**
 * Booking / press enquiries.
 *
 * The POST handler lives at /api/contact and still needs rate limiting and a
 * honeypot before launch — an unprotected form becomes a spam relay fast.
 */
export default function ContactPage() {
  return (
    <main>
      <h1>Contact</h1>
      <p>Booking and press enquiries.</p>

      <form action="/api/contact" method="post">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required />

        {/* Honeypot — hidden from people, tempting to bots. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit">Send</button>
      </form>
    </main>
  );
}
