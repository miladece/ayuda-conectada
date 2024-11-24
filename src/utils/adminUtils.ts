import { supabase } from "@/lib/supabase";

export const checkFirstUser = async (userId: string, userEmail: string) => {
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (count === 0) {
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        is_admin: true,
        user_email: userEmail,
      });

    return !updateError;
  }

  return false;
};

export const checkAdminStatus = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error checking admin status:", error);
    return false;
  }

  return profile?.is_admin || false;
};