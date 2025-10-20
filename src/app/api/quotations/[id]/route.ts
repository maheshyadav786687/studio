
import { NextResponse } from "next/server";
import * as quotationBLL from "@/lib/bll/quotation-bll";
import { QuotationFormData } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quotation = await quotationBLL.getQuotation(params.id);
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }
    return NextResponse.json(quotation, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch quotation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data: QuotationFormData = await request.json();
    const updatedQuotation = await quotationBLL.updateQuotation(params.id, data);
    return NextResponse.json(updatedQuotation, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await quotationBLL.deleteQuotation(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 }
    );
  }
}
