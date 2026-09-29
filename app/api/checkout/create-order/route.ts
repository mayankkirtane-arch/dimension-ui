import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { TEMPLATES } from "@/lib/site";
import { createPayPalOrder } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce Authentication (Requirement 6)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required. Please sign in to purchase templates.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    // 2. Parse request payload
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { templateId } = body;

    // Strict validation: NEVER trust browser-provided prices or user IDs
    if (!templateId || typeof templateId !== "string") {
      return NextResponse.json(
        { error: "Missing required parameter 'templateId'." },
        { status: 400 }
      );
    }

    const normalizedId = templateId.toLowerCase().trim();

    // 3. Look up trusted server-side template data (Requirement 4 & 5)
    const template = TEMPLATES.find((t) => t.id === normalizedId);
    if (!template) {
      return NextResponse.json(
        { error: `Template '${templateId}' not found in registry.` },
        { status: 404 }
      );
    }

    // 4. Free template behavior: free templates do not require payment
    if (template.tier === "free") {
      return NextResponse.json(
        {
          error: "Free templates do not require payment. You can download them directly.",
          code: "FREE_TEMPLATE",
          downloadUrl: `/api/download/${template.id}`,
        },
        { status: 400 }
      );
    }

    // 5. Prevent duplicate purchase if user already owns this template (Requirement 10)
    try {
      const { data: existingPurchases } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id);

      const alreadyOwned = (existingPurchases || []).some(
        (p: any) => p.template_id === template.id && (p.status === "paid" || p.status === "completed")
      );

      if (alreadyOwned) {
        return NextResponse.json(
          {
            error: "You have already purchased this template.",
            code: "ALREADY_OWNED",
            downloadUrl: `/api/download/${template.id}`,
          },
          { status: 400 }
        );
      }
    } catch {
      // ignore check error
    }

    // 6. Create PayPal Order on Server (Requirement 2 & 11)
    const idempotencyKey = request.headers.get("x-idempotency-key") || undefined;
    const paypalOrder = await createPayPalOrder({
      template,
      userId: user.id,
      idempotencyKey,
    });

    // 7. Store internal purchase status as 'pending' before payment completion (Requirement 7 & 8)
    try {
      const adminDb = await createAdminClient();
      await adminDb.from("purchases").insert({
        user_id: user.id,
        template_id: template.id,
        order_id: paypalOrder.orderId,
        amount: paypalOrder.amount,
        status: "pending",
        created_at: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Warning: Failed to persist pending purchase in database:", err.message);
    }

    return NextResponse.json({
      orderId: paypalOrder.orderId,
      status: paypalOrder.status,
      amount: paypalOrder.amount,
      currency: "USD",
      template: {
        id: template.id,
        name: template.name,
        price: template.price,
      },
    });
  } catch (err: any) {
    console.error("PayPal Create Order Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to create PayPal order." },
      { status: 500 }
    );
  }
}
