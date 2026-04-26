import { getLinkBySlug } from "@/data/links";
import { redirect, notFound } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;
  const link = await getLinkBySlug(shortcode);

  if (!link) {
    notFound();
  }

  redirect(link.url);
}
