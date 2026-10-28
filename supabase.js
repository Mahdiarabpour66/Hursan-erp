import { createClient } from "@supabase/supabase-js";

// Public (publishable) key only. Security comes from RLS rules in the database.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Returns the app user row for the logged-in auth user, or null.
export async function getCurrentAppUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("User")
    .select("id, fullName, email, isActive, Role(name, label)")
    .eq("authId", user.id)
    .maybeSingle();
  return data;
}
