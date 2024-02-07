import { NextResponse } from "next/server";
import { sendEmail } from "../../hooks/sendEmail";

export async function POST(request: any) {
  const data = await request.json();
  const { name, email, message } = data;

  try {
    const send = await sendEmail(name, email, message);
    return NextResponse.json({ Success: "yes" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
