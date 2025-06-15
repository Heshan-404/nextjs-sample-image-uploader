// /app/api/upload/route.js

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // The 'request.body' is a ReadableStream.
  // The 'put' function can directly handle this stream, so you don't need to buffer it.
  const blob = await put(filename, request.body, {
    access: 'public',
  });

  // Return the blob object, which includes its public URL.
  return NextResponse.json(blob);
}