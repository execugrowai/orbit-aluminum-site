import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Fields = Record<string, string | undefined>;

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let data: Fields;
  try {
    data = (await req.json()) as Fields;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(data.name, 200);
  const company = clean(data.company, 200);
  const email = clean(data.email, 254);
  const country = clean(data.country, 100);
  const product = clean(data.product, 100);
  const coating = clean(data.coating, 100);
  const thickness = clean(data.thickness, 50);
  const width = clean(data.width, 50);
  const message = clean(data.message, 5000);

  if (!name || !company || !email) {
    return NextResponse.json(
      { error: "Please fill in name, company and email." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The contact form is not configured yet." },
      { status: 500 }
    );
  }

  const text = [
    `Name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    `Country: ${country || "-"}`,
    `Product: ${product || "-"}`,
    `Coating system: ${coating || "-"}`,
    `Thickness (mm): ${thickness || "-"}`,
    `Width (mm): ${width || "-"}`,
    "",
    "Message:",
    message || "-",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Orbit Website <website@orbitaluminum.com>",
      to: [process.env.CONTACT_TO ?? "sales@orbitaluminum.com"],
      reply_to: email,
      subject: `Quote request: ${product || "General enquiry"} from ${company}`,
      text,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "We could not send your request. Please try again." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
