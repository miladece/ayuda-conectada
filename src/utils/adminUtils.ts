import { supabase } from "@/lib/supabase";

export const checkFirstUser = async (userId: string, userEmail: string) => {
  console.log("Checking if first user:", userId);
  
  try {
    // First create the profile if it doesn't exist
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        user_email: userEmail,
        is_admin: true,
        banned: false
      });

    if (insertError) {
      console.error("Error creating profile:", insertError);
      return false;
    }

    // Then check if this is the only profile
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error("Error checking profiles count:", countError);
      return false;
    }

    console.log("Total profiles:", count);
    return count === 1;
  } catch (error) {
    console.error("Error in checkFirstUser:", error);
    return false;
  }
};

export const checkAdminStatus = async (userId: string) => {
  console.log("Checking admin status for:", userId);
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    console.log("Admin status:", profile?.is_admin);
    return profile?.is_admin || false;
  } catch (error) {
    console.error("Error in checkAdminStatus:", error);
    return false;
  }
};