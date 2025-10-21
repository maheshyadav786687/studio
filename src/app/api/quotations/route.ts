
import { createQuotation } from "@/lib/bll/quotation-bll";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
    const quotationData = await request.json();
    const newQuotation = await createQuotation(quotationData);
    revalidatePath('/admin/quotations');
    revalidatePath('/dashboard/quotations');
    return NextResponse.json(newQuotation, { status: 201 });
}
