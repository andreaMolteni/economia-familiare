export async function onRequest({ request }) {
    const url = new URL(request.url);

    const BACKEND = "https://economia-familiare.onrender.com";
    const targetUrl = BACKEND + url.pathname.replace(/^\/api/, "") + url.search;

    // Preflight
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204 });
    }

    // Bufferizza il body (evita problemi di stream)
    let body = undefined;
    if (!["GET", "HEAD"].includes(request.method)) {
        body = await request.clone().arrayBuffer();
    }

    // Clona headers e rimuovi quelli che rompono i proxy
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("content-length");
    headers.delete("accept-encoding");
    headers.delete("connection");

    const upstream = await fetch(targetUrl, {
        method: request.method,
        headers,
        body,
        redirect: "manual",
    });

    const resHeaders = new Headers(upstream.headers);
    resHeaders.set("x-pages-proxy", "1");
    resHeaders.set("x-upstream-status", String(upstream.status));

    // Riscrivi Set-Cookie Path: /auth -> /api/auth
    const sc = resHeaders.get("set-cookie");
    if (sc) {
        resHeaders.set(
            "set-cookie",
            sc.replace(/;\s*Path=\/auth\b/i, "; Path=/api/auth")
        );
    }

    return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: resHeaders,
    });
}
