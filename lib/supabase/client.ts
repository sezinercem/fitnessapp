"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicKey, supabaseUrl } from "@/lib/supabase/env";

export function createClient() {
  return createBrowserClient(supabaseUrl(), supabasePublicKey());
}
