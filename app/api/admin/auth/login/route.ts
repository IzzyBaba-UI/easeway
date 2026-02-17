import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD not set in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      // Generate a simple token (hash of password + timestamp)
      const timestamp = Date.now();
      const token = crypto
        .createHash("sha256")
        .update(`${adminPassword}-${timestamp}-${process.env.NEXTAUTH_SECRET || "secret"}`)
        .digest("hex");

      // Store the token timestamp for verification (in a real app, use a database)
      // For simplicity, we'll encode the timestamp in the token
      const fullToken = `${token}.${timestamp}`;

      return NextResponse.json({ token: fullToken });
    }

    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
