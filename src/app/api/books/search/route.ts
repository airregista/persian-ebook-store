import { NextRequest, NextResponse } from 'next/server';
import { searchFidibo } from '@/lib/fidibo-client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const kind = searchParams.get('kind') || undefined;

  const books = await searchFidibo(q, kind);
  return NextResponse.json({
    books,
    total: books.length,
  });
}
