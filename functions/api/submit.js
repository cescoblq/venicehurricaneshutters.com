// Server-side relay to the central n8n webhook. The browser never sees the n8n URL —
// avoids a visible cross-site network footprint ("view-source"/devtools network tab) if
// every US site pointed directly at the same n8n.byteblast.ovh host.
//
// TODO (see TODO-DEPLOY.md): the n8n webhook "niches-leads-hurricane-shutters-us" does not
// exist yet — it needs to be created in n8n before this relay will actually deliver leads.
export async function onRequestPost({ request }) {
  const body = await request.text();

  const upstream = await fetch("https://n8n.byteblast.ovh/webhook/niches-leads-hurricane-shutters-us", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
