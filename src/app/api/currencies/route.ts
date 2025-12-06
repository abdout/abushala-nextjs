import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

// GET all currencies
export async function GET() {
  try {
    const currencies = await db.currency.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(currencies);
  } catch (error) {
    console.error("[CURRENCIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST create new currency (admin only)
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, code, buyPrice, sellPrice } = body;

    if (!name || !code || buyPrice === undefined || sellPrice === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const currency = await db.currency.create({
      data: {
        name,
        code: code.toUpperCase(),
        buyPrice: parseFloat(buyPrice),
        sellPrice: parseFloat(sellPrice),
        change: 0,
      },
    });

    return NextResponse.json(currency);
  } catch (error) {
    console.error("[CURRENCIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
