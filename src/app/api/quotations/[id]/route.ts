
import { NextRequest, NextResponse } from "next/server";
import { getQuotationById, updateQuotation, deleteQuotation } from "@/lib/bll/quotation-bll";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const quotation = await getQuotationById(params.id);
    if (!quotation) {
        return NextResponse.json({ message: "Quotation not found" }, { status: 404 });
    }
    return NextResponse.json(quotation);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const quotationData = await request.json();
    const updatedQuotation = await updateQuotation(params.id, quotationData);
    revalidatePath('/admin/quotations');
    revalidatePath('/dashboard/quotations');
    revalidatePath(`/admin/quotations/${params.id}`);
    return NextResponse.json(updatedQuotation);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await deleteQuotation(params.id);
    revalidatePath('/admin/quotations');
    revalidatePath('/dashboard/quotations');
    return NextResponse.json({ message: "Quotation deleted" }, { status: 200 });
}
