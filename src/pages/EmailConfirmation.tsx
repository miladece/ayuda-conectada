import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log("Starting email confirmation process");
        
        // Get the current URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        console.log("Hash parameters:", { error, errorDescription });

        if (error || errorDescription) {
          throw new Error(errorDescription || 'Error en la verificación del email');
        }

        // The email should be automatically confirmed by Supabase at this point
        // We just need to show the success message
        console.log("Email verification successful");
        
        toast({
          title: "¡Email verificado!",
          description: "Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.",
        });
        
        navigate('/login');
      } catch (error: any) {
        console.error("Email confirmation error:", error);
        setError(error.message || "Error al verificar el email");
        toast({
          variant: "destructive",
          title: "Error en la verificación",
          description: error.message || "Error al verificar el email",
        });
      } finally {
        setVerifying(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          {verifying ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Verificando email...</h2>
              <p className="text-gray-600">
                Por favor, espera mientras verificamos tu dirección de email.
              </p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-red-600">Error en la verificación</h2>
              <p className="text-gray-600">{error}</p>
              <div className="pt-4">
                <Button onClick={() => navigate('/signup')}>
                  Volver al registro
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-600">¡Verificación completada!</h2>
              <p className="text-gray-600">
                Tu email ha sido verificado correctamente. Ya puedes iniciar sesión.
              </p>
              <div className="pt-4">
                <Button onClick={() => navigate('/login')}>
                  Ir a Iniciar Sesión
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmailConfirmation;