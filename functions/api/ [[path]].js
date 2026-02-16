export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Backend Render
    const BACKEND = "https://economia-familiare.onrender.com";

    // /api/...  ->  backend/...
    const targetUrl = BACKEND + url.pathname.replace(/^\/api/, "") + url.search;

    // Preflight: rispondi OK (evita 405 su OPTIONS)
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204 });
    }

    const upstream = await fetch(targetUrl, request);

    // Copia headers e riscrivi Set-Cookie Path (Path=/auth -> Path=/api/auth)
    const headers = new Headers(upstream.headers);

    const sc = headers.get("Set-Cookie");
    if (sc) {
        headers.set("Set-Cookie", sc.replace(/;\s*Path=\/auth\b/i, "; Path=/api/auth"));
    }

    return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers,
    });
}
