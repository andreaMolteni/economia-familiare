export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const BACKEND = "https://economia-familiare.onrender.com";
    const targetUrl = BACKEND + url.pathname.replace(/^\/api/, "") + url.search;

    // Preflight
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204 });
    }

    // Clona headers e togli host (evita casini)
    const headers = new Headers(request.headers);
    headers.delete("host");

    // Crea una nuova request verso backend
    const upstreamReq = new Request(targetUrl, {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD" ? null : request.body,
        redirect: "manual",
    });

    const upstream = await fetch(upstreamReq);

    const resHeaders = new Headers(upstream.headers);
    resHeaders.set("x-pages-proxy", "1");

    // Riscrivi Set-Cookie Path: /auth -> /api/auth
    const sc = resHeaders.get("Set-Cookie");
    if (sc) {
        resHeaders.set("Set-Cookie", sc.replace(/;\s*Path=\/auth\b/i, "; Path=/api/auth"));
    }

    return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: resHeaders,
    });
}
