
import { NextResponse } from "next/server";
import * as quotationBLL from "@/lib/bll/quotation-bll";
import { QuotationFormData } from "@/lib/types";

export async function GET() {
  try {
    const quotations = await quotationBLL.getQuotations();
    return NextResponse.json(quotations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: QuotationFormData = await request.json();
    const newQuotation = await quotationBLL.createQuotation(data);
    return NextResponse.json(newQuotation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create quotation" },
      { status: 500 }
    );
  }
}
