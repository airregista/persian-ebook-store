import { NextRequest, NextResponse } from 'next/server';
import { getFidiboBookDetails } from '@/lib/fidibo-client';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  const data = await getFidiboBookDetails(id);

  if (!data) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  return NextResponse.json({
    book: data.book,
    reviews: data.reviews,
  });
}
