import type { Metadata } from "next";
import { notFound } from "next/navigation";
import pages from "@/data/pages.json";
import ContactForm from "../contact-form";

type Page = { path: string; title: string; description: string; body: string };
const all = pages as Page[];

type Props = { params: Promise<{ slug?: string[] }> };

function findPage(slug?: string[]): Page | undefined {
  const path = slug && slug.length ? "/" + slug.join("/") + "/" : "/";
  return all.find((p) => p.path === path);
}

export function generateStaticParams() {
  return all.map((p) => ({
    slug: p.path === "/" ? [] : p.path.split("/").filter(Boolean),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findPage((await params).slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function Page({ params }: Props) {
  const page = findPage((await params).slug);
  if (!page) notFound();
  if (page.path === "/contact/") {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: page.body }} />
        <ContactForm />
      </>
    );
  }
  return <div dangerouslySetInnerHTML={{ __html: page.body }} />;
}
