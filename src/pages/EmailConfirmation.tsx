import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log("Starting email confirmation process");
        const token_hash = searchParams.get('token_hash');
        const error = searchParams.get('error');
        const error_description = searchParams.get('error_description');
        
        console.log("Confirmation parameters:", { token_hash, error, error_description });

        if (error || error_description) {
          throw new Error(error_description || 'Error en la verificación del email');
        }

        if (!token_hash) {
          throw new Error('No se encontró el token de verificación');
        }

        const { error: verificationError } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'signup',
        });

        if (verificationError) throw verificationError;

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
  }, [searchParams, navigate, toast]);

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