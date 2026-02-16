export async function onRequest({ request }) {
    try {
        const url = new URL(request.url);

        const BACKEND_ORIGIN = "https://economia-familiare.onrender.com";
        const targetUrl =
            BACKEND_ORIGIN + url.pathname.replace(/^\/api/, "") + url.search;

        // Preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204 });
        }

        // Clona headers e rimuovi quelli "pericolosi" nei proxy
        const headers = new Headers(request.headers);
        headers.delete("host");
        headers.delete("content-length");
        headers.delete("accept-encoding");
        headers.delete("connection");

        // Bufferizza body in modo sicuro (clone!)
        let body = undefined;
        if (!["GET", "HEAD"].includes(request.method)) {
            body = await request.clone().arrayBuffer();
        }

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
        const setCookie = resHeaders.get("set-cookie");
        if (setCookie) {
            resHeaders.set(
                "set-cookie",
                setCookie.replace(/;\s*Path=\/auth\b/i, "; Path=/api/auth")
            );
        }

        return new Response(upstream.body, {
            status: upstream.status,
            statusText: upstream.statusText,
            headers: resHeaders,
        });
    } catch (e) {
        // Se esplode, NON far vedere HTML Cloudflare: ritorna testo chiaro
        return new Response(
            `Pages proxy exception:\n${e && e.stack ? e.stack : String(e)}`,
            { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
        );
    }
}
