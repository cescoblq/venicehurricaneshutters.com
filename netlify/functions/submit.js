// Server-side relay to the central n8n webhook. The browser never sees the n8n URL:
// avoids a visible cross-site network footprint ("view-source"/devtools network tab) if
// every site in the network pointed directly at the same n8n.byteblast.ovh host.
//
// X-Site-Origin is derived from the Host header Netlify actually routed the request on,
// not from the browser's Origin header — same-origin by construction, so this is
// trustworthy server-side data, unlike a client-supplied header.
//
// Netlify Functions use the classic Lambda-style handler (not Cloudflare Pages Functions'
// onRequestPost), and by default are only reachable at /.netlify/functions/<name> unless a
// redirect maps a nicer path to it (see netlify.toml: /api/submit -> this function).
exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const origin = `https://${event.headers.host}`;

    const params = new URLSearchParams(event.body);
    const isBot = params.get("hp_confirm") || Number(params.get("elapsed_ms")) < 2000;
    if (isBot) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: true }),
      };
    }
    params.delete("hp_confirm");
    params.delete("elapsed_ms");

    const upstream = await fetch("https://n8n.byteblast.ovh/webhook/niches-leads-hurricane-shutters-us", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Site-Origin": origin },
      body: params.toString(),
    });
    const text = await upstream.text();
    return {
      statusCode: upstream.status,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "upstream_failed" }),
    };
  }
};
