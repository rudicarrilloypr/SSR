import { createClient } from "@supabase/supabase-js";

const allowedTypes = new Set(["sample", "sample_pack", "instrumental"]);

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return json({ message: "Método no permitido." }, 405);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "ssr-private";
  const authorization = request.headers.get("authorization");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json({ message: "La cámara privada aún no está configurada." }, 503);
  }

  if (!authorization?.startsWith("Bearer ")) {
    return json({ message: "Identidad requerida." }, 401);
  }

  let payload: { contentType?: string; contentId?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ message: "Invocación inválida." }, 400);
  }

  if (
    !payload.contentType ||
    !allowedTypes.has(payload.contentType) ||
    !payload.contentId
  ) {
    return json({ message: "Registro de descarga inválido." }, 400);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: { Authorization: authorization },
    },
    auth: { persistSession: false },
  });

  const { data, error } = await userClient.rpc("request_download", {
    p_content_type: payload.contentType,
    p_content_id: payload.contentId,
  });

  if (error) {
    const messages: Record<string, string> = {
      AUTH_REQUIRED: "Identidad requerida.",
      ACTIVE_SUBSCRIPTION_REQUIRED: "Esta frecuencia requiere una membresía activa.",
      MONTHLY_LIMIT_REACHED: "Tu cuota mensual para este archivo se ha agotado.",
      CONTENT_NOT_AVAILABLE: "El registro no está disponible.",
    };
    return json({ message: messages[error.message] ?? "La descarga fue rechazada." }, 403);
  }

  const result = (
    data as Array<{
      download_id: string;
      storage_path: string;
      remaining_count: number | null;
    }>
  )?.[0];

  if (!result?.storage_path) {
    return json({ message: "El archivo no fue localizado." }, 404);
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const { data: signed, error: signedError } = await serviceClient.storage
    .from(bucket)
    .createSignedUrl(result.storage_path, 60);

  if (signedError || !signed?.signedUrl) {
    return json({ message: "No fue posible abrir la cámara privada." }, 500);
  }

  return json({
    signedUrl: signed.signedUrl,
    downloadId: result.download_id,
    remaining: result.remaining_count,
  });
}
