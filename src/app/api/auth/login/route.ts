import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/features/auth/mockUsers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json(user);
}