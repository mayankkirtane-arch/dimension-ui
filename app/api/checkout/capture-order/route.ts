import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { TEMPLATES } from "@/lib/site";
import { capturePayPalOrder, generateLicenseKey } from "@/lib/paypal";

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
          error: "Authentication required to complete purchase.",
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

    const { orderId, templateId } = body;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "Missing required parameter 'orderId'." },
        { status: 400 }
      );
    }

    if (!templateId || typeof templateId !== "string") {
      return NextResponse.json(
        { error: "Missing required parameter 'templateId'." },
        { status: 400 }
      );
    }

    const normalizedTemplateId = templateId.toLowerCase().trim();
    const template = TEMPLATES.find((t) => t.id === normalizedTemplateId);
    if (!template) {
      return NextResponse.json(
        { error: `Template '${templateId}' not found.` },
        { status: 404 }
      );
    }

    // 3. Prevent duplicate capture (Requirement 10)
    let existingPurchase: any = null;
    try {
      const { data } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id);

      existingPurchase = (data || []).find((p: any) => p.order_id === orderId);

      if (existingPurchase && (existingPurchase.status === "paid" || existingPurchase.status === "completed")) {
        return NextResponse.json({
          success: true,
          orderId,
          templateId: template.id,
          licenseKey: existingPurchase.license_key,
          downloadUrl: `/api/download/${template.id}`,
          message: "Order already captured and verified.",
          isDuplicate: true,
        });
      }
    } catch {
      // ignore lookup error
    }

    // 4. Capture PayPal order on server (Requirement 3 & 11)
    const idempotencyKey = request.headers.get("x-idempotency-key") || undefined;
    const captureResult = await capturePayPalOrder({
      orderId,
      idempotencyKey,
    });

    // 5. Mark purchase as paid ONLY after successful verified capture (Requirement 9)
    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: `PayPal payment failed with status '${captureResult.status}'.`,
          code: "PAYMENT_NOT_COMPLETED",
        },
        { status: 400 }
      );
    }

    const licenseKey = generateLicenseKey(template.id);
    const numericPrice = parseFloat(template.tier) || parseFloat(template.price.replace("$", "")) || 0;

    // 6. Update or insert verified purchase record in database (Requirement 8 & 9)
    try {
      const adminDb = await createAdminClient();
      if (existingPurchase) {
        await adminDb
          .from("purchases")
          .update({
            status: "paid",
            capture_id: captureResult.captureId,
            license_key: licenseKey,
            license_type: "Commercial (Unlimited Projects)",
            updated_at: new Date().toISOString(),
          })
          .eq("order_id", orderId);
      } else {
        await adminDb.from("purchases").insert({
          user_id: user.id,
          template_id: template.id,
          order_id: orderId,
          capture_id: captureResult.captureId,
          amount: numericPrice.toFixed(2),
          status: "paid",
          license_key: licenseKey,
          license_type: "Commercial (Unlimited Projects)",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error("Warning: Failed to update purchase record:", err.message);
    }

    return NextResponse.json({
      success: true,
      orderId,
      captureId: captureResult.captureId,
      templateId: template.id,
      templateName: template.name,
      licenseKey,
      downloadUrl: `/api/download/${template.id}`,
      dashboardUrl: "/dashboard",
    });
  } catch (err: any) {
    console.error("PayPal Capture Order Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to capture PayPal order." },
      { status: 500 }
    );
  }
}
