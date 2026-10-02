import { NextResponse } from 'next/server';
import { getRandomArticleSlug } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const randomSlug = await getRandomArticleSlug();
  return NextResponse.redirect(new URL(`/article/${randomSlug}`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
