// Test script to verify frontend can call backend login API
// Using built-in fetch (Node.js 18+)

async function testLogin() {
    const API_BASE_URL = "http://localhost:8000";
    const orgName = "beta";
    const email = "test@beta.com";
    const password = "password123";

    const queryParams = new URLSearchParams({ orgName });
    const url = `${API_BASE_URL}/api/auth/login/?${queryParams}`;

    console.log("🔵 Testing login API call...");
    console.log("🔵 URL:", url);
    console.log("🔵 Credentials:", { email, orgName });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        console.log("🔵 Response status:", response.status);
        console.log("🔵 Response ok:", response.ok);

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Login successful!");
            console.log("🔵 Token received:", data.token);

            // Test authenticated endpoint
            await testAuthenticatedEndpoint(data.token, orgName);
        } else {
            const errorText = await response.text();
            console.error("❌ Login failed:", response.status, errorText);
        }
    } catch (error) {
        console.error("❌ Network error:", error.message);
    }
}

async function testAuthenticatedEndpoint(token, orgName) {
    const API_BASE_URL = "http://localhost:8000";
    const queryParams = new URLSearchParams({ org_name: orgName });
    const url = `${API_BASE_URL}/api/auth/members/?${queryParams}`;

    console.log("\n🔵 Testing authenticated endpoint...");
    console.log("🔵 URL:", url);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        });

        console.log("🔵 Response status:", response.status);
        console.log("🔵 Response ok:", response.ok);

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Authenticated request successful!");
            console.log("🔵 Members data:", JSON.stringify(data, null, 2));
        } else {
            const errorText = await response.text();
            console.error(
                "❌ Authenticated request failed:",
                response.status,
                errorText,
            );
        }
    } catch (error) {
        console.error("❌ Network error:", error.message);
    }
}

// Run the test
testLogin();
