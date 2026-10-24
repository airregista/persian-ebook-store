import { NextRequest, NextResponse } from 'next/server';
import { getFidiboBooks } from '@/lib/fidibo-client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shelf = searchParams.get('shelf') || undefined;
  const category = searchParams.get('category') || undefined;

  const books = await getFidiboBooks(shelf, category);
  return NextResponse.json({
    books,
    total: books.length,
  });
}
