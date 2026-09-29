/**
 * Test Suite: PayPal Sandbox Checkout
 * Verifies all security, authorization, pricing integrity, and error states.
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

const TEST_USER = {
  id: "test-user-paypal-" + Date.now(),
  email: "developer@dimensionui.com",
};

const AUTH_COOKIE = `sb-test-user=${encodeURIComponent(JSON.stringify(TEST_USER))}`;

async function runTests() {
  console.log("=================================================");
  console.log("   DimensionUI PayPal Sandbox Checkout Tests     ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✔ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Logged-out purchase rejection (Requirement 6)
  console.log("Test 1: Logged-out purchase (Must return 401 Unauthorized)");
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: "peak-fitness" }),
    });
    const data = await res.json();
    assert(res.status === 401, "Rejected unauthenticated checkout with HTTP 401");
    assert(data.code === "AUTH_REQUIRED", "Returned AUTH_REQUIRED error code");
  } catch (err) {
    console.error("Test 1 error:", err.message);
    failed++;
  }

  // 2. Free template behavior (Must not charge for free templates)
  console.log("\nTest 2: Free template behavior (Must reject order creation)");
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: AUTH_COOKIE,
      },
      body: JSON.stringify({ templateId: "aether-ai-saas" }), // Free template ($0)
    });
    const data = await res.json();
    assert(res.status === 400, "Rejected payment for free template with HTTP 400");
    assert(data.code === "FREE_TEMPLATE", "Returned FREE_TEMPLATE code with direct downloadUrl");
  } catch (err) {
    console.error("Test 2 error:", err.message);
    failed++;
  }

  // 3. Modified template ID (Must return 404)
  console.log("\nTest 3: Modified / Fake template ID (Must return 404)");
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: AUTH_COOKIE,
      },
      body: JSON.stringify({ templateId: "hacked-non-existent-template" }),
    });
    const data = await res.json();
    assert(res.status === 404, "Rejected invalid template ID with HTTP 404");
  } catch (err) {
    console.error("Test 3 error:", err.message);
    failed++;
  }

  // 4. Modified browser price (Server MUST ignore browser price and use trusted price)
  console.log("\nTest 4: Modified browser price ($0.01 tampering attempt)");
  let createdOrderId = "";
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: AUTH_COOKIE,
      },
      body: JSON.stringify({
        templateId: "peak-fitness", // Official price is $15.00
        price: "$0.01", // Tampered browser price
        amount: "0.01",
      }),
    });
    const data = await res.json();
    assert(res.status === 200, "Created order successfully");
    assert(data.amount === "15.00", `Server enforced trusted price of $15.00 (got ${data.amount})`);
    assert(data.orderId && data.orderId.length > 5, `Received valid PayPal orderId: ${data.orderId}`);
    createdOrderId = data.orderId;
  } catch (err) {
    console.error("Test 4 error:", err.message);
    failed++;
  }

  // 5. Payment capture without auth (Must return 401)
  console.log("\nTest 5: Capture order without authentication");
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/capture-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: createdOrderId,
        templateId: "peak-fitness",
      }),
    });
    assert(res.status === 401, "Rejected unauthenticated capture with HTTP 401");
  } catch (err) {
    console.error("Test 5 error:", err.message);
    failed++;
  }

  // 6. Legitimate paid template capture
  console.log("\nTest 6: Verified capture of paid template order");
  let capturedLicenseKey = "";
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/capture-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: AUTH_COOKIE,
      },
      body: JSON.stringify({
        orderId: createdOrderId,
        templateId: "peak-fitness",
      }),
    });
    const data = await res.json();
    assert(res.status === 200, "Order captured successfully with HTTP 200");
    assert(data.success === true, "Returned success: true");
    assert(data.licenseKey && data.licenseKey.startsWith("DIM-"), `Assigned valid license key: ${data.licenseKey}`);
    assert(data.downloadUrl === "/api/download/peak-fitness", "Provided download URL");
    capturedLicenseKey = data.licenseKey;
  } catch (err) {
    console.error("Test 6 error:", err.message);
    failed++;
  }

  // 7. Duplicate click / duplicate capture protection (Requirement 10)
  console.log("\nTest 7: Duplicate click / duplicate capture protection");
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/capture-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: AUTH_COOKIE,
      },
      body: JSON.stringify({
        orderId: createdOrderId,
        templateId: "peak-fitness",
      }),
    });
    const data = await res.json();
    assert(res.status === 200, "Duplicate capture handled gracefully with HTTP 200");
    assert(data.isDuplicate === true, "Identified as duplicate order capture");
    assert(data.licenseKey === capturedLicenseKey, "Retained identical original license key");
  } catch (err) {
    console.error("Test 7 error:", err.message);
    failed++;
  }

  // 8. Download authorized template after verified capture
  console.log("\nTest 8: Immediate ZIP download authorization for captured template");
  try {
    const res = await fetch(`${BASE_URL}/api/download/peak-fitness`, {
      headers: { Cookie: AUTH_COOKIE },
    });
    assert(res.status === 200, "Allowed download with HTTP 200");
    assert(res.headers.get("content-type") === "application/zip", "Returned Content-Type: application/zip");
    const buffer = await res.arrayBuffer();
    assert(buffer.byteLength > 500, `Generated valid ZIP archive of ${buffer.byteLength} bytes`);
  } catch (err) {
    console.error("Test 8 error:", err.message);
    failed++;
  }

  // 9. Payment failure handling (Missing / invalid order ID)
  console.log("\nTest 9: Payment failure handling (Missing / invalid order ID)");
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/capture-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: AUTH_COOKIE,
      },
      body: JSON.stringify({
        orderId: "",
        templateId: "aether-ai-saas",
      }),
    });
    assert(res.status === 400, "Rejected invalid order ID with HTTP 400");
  } catch (err) {
    console.error("Test 9 error:", err.message);
    failed++;
  }

  // 10. Duplicate purchase prevention for already-owned template
  console.log("\nTest 10: Duplicate purchase prevention for already-owned template");
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: AUTH_COOKIE,
      },
      body: JSON.stringify({ templateId: "peak-fitness" }),
    });
    const data = await res.json();
    assert(res.status === 400, "Rejected duplicate purchase with HTTP 400");
    assert(data.code === "ALREADY_OWNED", "Returned ALREADY_OWNED code with direct downloadUrl");
  } catch (err) {
    console.error("Test 10 error:", err.message);
    failed++;
  }

  // 11. Security Audit: Zero Secret Leak in Response Bodies
  console.log("\nTest 11: Security check - Verify zero secrets/tokens leaked in client responses");
  try {
    const res = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: AUTH_COOKIE,
      },
      body: JSON.stringify({ templateId: "velvet-bistro" }),
    });
    const text = await res.text();
    assert(!text.toLowerCase().includes("secret"), "No 'secret' keyword in JSON response");
    assert(!text.toLowerCase().includes("access_token"), "No 'access_token' in JSON response");
    assert(!text.toLowerCase().includes("client_credentials"), "No 'client_credentials' in JSON response");
  } catch (err) {
    console.error("Test 11 error:", err.message);
    failed++;
  }

  console.log("\n=================================================");
  console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
