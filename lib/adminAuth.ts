import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

function verifyToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [hash, timestampStr] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check if token is expired (24 hours)
  const maxAge = 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAge) return false;

  const expectedHash = crypto
    .createHash("sha256")
    .update(
      `${adminPassword}-${timestamp}-${process.env.NEXTAUTH_SECRET || "secret"}`
    )
    .digest("hex");

  return hash === expectedHash;
}

export function authenticateAdmin(
  request: NextRequest
): { authenticated: true } | { authenticated: false; response: NextResponse } {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token || !verifyToken(token)) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  return { authenticated: true };
}
