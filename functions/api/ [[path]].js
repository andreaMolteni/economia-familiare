export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const BACKEND = "https://economia-familiare.onrender.com";
    const targetUrl = BACKEND + url.pathname.replace(/^\/api/, "") + url.search;

    // Preflight
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: { "x-pages-proxy": "preflight" } });
    }

    try {
        // Clona headers e rimuovi quelli che spesso rompono il forward
        const headers = new Headers(request.headers);
        headers.delete("host");
        headers.delete("content-length"); // IMPORTANTISSIMO
        headers.delete("accept-encoding"); // lascia che CF gestisca

        const upstreamReq = new Request(targetUrl, {
            method: request.method,
            headers,
            body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
            redirect: "manual",
        });

        const upstream = await fetch(upstreamReq);

        const resHeaders = new Headers(upstream.headers);
        resHeaders.set("x-pages-proxy", "1");                 // marker: sei passato dalla function
        resHeaders.set("x-upstream-status", String(upstream.status));

        // Riscrivi Set-Cookie Path (/auth -> /api/auth)
        const sc = resHeaders.get("Set-Cookie");
        if (sc) {
            resHeaders.set("Set-Cookie", sc.replace(/;\s*Path=\/auth\b/i, "; Path=/api/auth"));
        }

        return new Response(upstream.body, {
            status: upstream.status,
            statusText: upstream.statusText,
            headers: resHeaders,
        });
    } catch (err) {
        // Se il proxy crasha, lo vedi qui (e non più "misterioso 500")
        return new Response(
            `Pages proxy error: ${err?.message || String(err)}\nTarget: ${targetUrl}`,
            { status: 502, headers: { "content-type": "text/plain", "x-pages-proxy": "error" } }
        );
    }
}
