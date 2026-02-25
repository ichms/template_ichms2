import { NextResponse } from "next/server";

// Responsibility: Basic placeholder API route for build-time type checks.
export const GET = () => {
  return NextResponse.json({ ok: true });
};
