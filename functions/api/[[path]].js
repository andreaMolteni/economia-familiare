export async function onRequest() {
    return new Response("OK FROM PAGES FUNCTION", {
        status: 200,
        headers: {
            "content-type": "text/plain; charset=utf-8",
            "x-pages-proxy": "1",
        },
    });
}
