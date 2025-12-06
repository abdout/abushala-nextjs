import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

// PATCH update currency (admin only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, code, buyPrice, sellPrice } = body;

    const existingCurrency = await db.currency.findUnique({
      where: { id },
    });

    if (!existingCurrency) {
      return new NextResponse("Currency not found", { status: 404 });
    }

    // Calculate price change
    const newBuyPrice = buyPrice !== undefined ? parseFloat(buyPrice) : existingCurrency.buyPrice;
    const change = newBuyPrice - existingCurrency.buyPrice;

    const currency = await db.currency.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code: code.toUpperCase() }),
        ...(buyPrice !== undefined && { buyPrice: newBuyPrice }),
        ...(sellPrice !== undefined && { sellPrice: parseFloat(sellPrice) }),
        change,
      },
    });

    return NextResponse.json(currency);
  } catch (error) {
    console.error("[CURRENCY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE currency (admin only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.currency.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CURRENCY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
