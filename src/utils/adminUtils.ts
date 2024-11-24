import { supabase } from "@/lib/supabase";

export const checkFirstUser = async (userId: string, userEmail: string) => {
  console.log("Checking if first user:", userId);
  
  try {
    // First check if the user's profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      console.log("Profile already exists:", existingProfile);
      return existingProfile.is_admin;
    }

    // Check if any profiles exist
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error("Error checking profiles count:", countError);
      return false;
    }

    console.log("Total profiles:", count);

    // If no profiles exist, create the first admin user
    if (count === 0) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          name: userEmail,
          is_admin: true,
          banned: false
        });

      if (insertError) {
        console.error("Error creating first admin profile:", insertError);
        return false;
      }

      console.log("Created first admin user:", userId);
      return true;
    }

    // If profiles exist but this user doesn't have one, create a regular user profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        name: userEmail,
        is_admin: false,
        banned: false
      });

    if (insertError) {
      console.error("Error creating user profile:", insertError);
    }

    return false;
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