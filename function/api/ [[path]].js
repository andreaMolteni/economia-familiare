export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Backend Render
    const BACKEND = "https://economia-familiare.onrender.com";

    // /api/...  ->  backend/...
    const targetUrl = BACKEND + url.pathname.replace(/^\/api/, "") + url.search;

    // Preflight (in teoria same-origin non serve, ma va bene gestirlo)
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204 });
    }

    const upstream = await fetch(targetUrl, request);

    // Copia headers e riscrivi Set-Cookie Path
    const headers = new Headers(upstream.headers);

    // Riscrittura cookie: Path=/auth -> Path=/api/auth
    // (necessario perché dal browser ora chiami /api/auth/*)
    const setCookies =
        typeof upstream.headers.getSetCookie === "function"
            ? upstream.headers.getSetCookie()
            : (headers.get("Set-Cookie") ? [headers.get("Set-Cookie")] : []);

    if (setCookies.length > 0) {
        headers.delete("Set-Cookie");
        for (const sc of setCookies) {
            const rewritten = sc.replace(/;\s*Path=\/auth\b/i, "; Path=/api/auth");
            headers.append("Set-Cookie", rewritten);
        }
    }

    return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers,
    });
}