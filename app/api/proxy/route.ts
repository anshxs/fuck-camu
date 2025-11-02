import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const endpoint = request.nextUrl.searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint parameter is required" },
        { status: 400 }
      );
    }

    // Get session cookie from request header (sent by client)
    const sessionCookie = request.headers.get("x-session-cookie");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "appversion": "v1",
      "clienttzofst": "330",
    };

    // Add session cookie if available
    if (sessionCookie) {
      headers["Cookie"] = sessionCookie;
    }

    console.log("Proxying request to:", `https://www.mycamu.co.in${endpoint}`);
    console.log("With cookie:", sessionCookie ? "Present" : "None");

    const response = await fetch(`https://www.mycamu.co.in${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Extract set-cookie from response (for login)
    const setCookieHeaders = response.headers.getSetCookie();
    const nextResponse = NextResponse.json(data);
    
    // Forward all cookies
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      // Send cookies back to client in a custom header they can store
      nextResponse.headers.set("x-session-cookie", setCookieHeaders.join("; "));
      console.log("Setting session cookies:", setCookieHeaders);
    }
    
    return nextResponse;
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const endpoint = request.nextUrl.searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint parameter is required" },
        { status: 400 }
      );
    }

    // Get session cookie from request header (sent by client)
    const sessionCookie = request.headers.get("x-session-cookie");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add session cookie if available
    if (sessionCookie) {
      headers["Cookie"] = sessionCookie;
    }

    const response = await fetch(`https://www.mycamu.co.in${endpoint}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    
    // Extract set-cookie from response
    const setCookieHeaders = response.headers.getSetCookie();
    const nextResponse = NextResponse.json(data);
    
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      nextResponse.headers.set("x-session-cookie", setCookieHeaders.join("; "));
    }
    
    return nextResponse;
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
