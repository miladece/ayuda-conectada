import { supabase } from "@/lib/supabase";

export const checkFirstUser = async (userId: string, userEmail: string) => {
  console.log("Checking if first user:", userId);
  
  const { count, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error("Error checking profiles count:", countError);
    return false;
  }

  console.log("Total profiles:", count);

  if (count === 0) {
    console.log("No profiles found, creating first admin user");
    const { error: updateError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        is_admin: true,
        user_email: userEmail,
        banned: false
      });

    if (updateError) {
      console.error("Error creating admin profile:", updateError);
      return false;
    }

    return true;
  }

  return false;
};

export const checkAdminStatus = async (userId: string) => {
  console.log("Checking admin status for:", userId);
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error checking admin status:", error);
    return false;
  }

  console.log("Admin status:", profile?.is_admin);
  return profile?.is_admin || false;
};