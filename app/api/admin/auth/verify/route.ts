import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Parse the token
    const parts = token.split(".");
    if (parts.length !== 2) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 });
    }

    const [hash, timestampStr] = parts;
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if token is expired (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (Date.now() - timestamp > maxAge) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    // Verify the hash
    const expectedHash = crypto
      .createHash("sha256")
      .update(`${adminPassword}-${timestamp}-${process.env.NEXTAUTH_SECRET || "secret"}`)
      .digest("hex");

    if (hash === expectedHash) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
