import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Simple health check that keeps the project active
  return new Response(
    JSON.stringify({ status: "active", timestamp: new Date().toISOString() }),
    { headers: { "Content-Type": "application/json" } }
  )
})
