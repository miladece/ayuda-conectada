import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createProfile = async (userId: string, userEmail: string) => {
    console.log("Creating profile for:", { userId, userEmail });
    
    const { error } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: userId,
          email: userEmail,
          is_admin: false,
          banned: false
        }
      ]);

    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
    
    console.log("Profile created successfully");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Starting signup process");
      
      // Clear any existing auth state and cached queries
      await supabase.auth.signOut();
      queryClient.clear();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      console.log("Signup response:", data);

      if (data.user) {
        await createProfile(data.user.id, email);
      }

      setVerificationSent(true);
      
      toast({
        title: "¡Registro iniciado!",
        description: "Has iniciado el registro, en cuanto este listo ya puedes publicar anuncios.",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium">¡Te has registrado correctamente!</h3>
        <p className="text-gray-600">
          Te has registrado correctamente con el email: {email}. 
          Ahora ya puedes iniciar sesión directamente y empezar a publicar.
        </p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Ir a Página Principal
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </Button>
    </form>
  );
};