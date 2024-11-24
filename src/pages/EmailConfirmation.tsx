import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log("Starting email confirmation process");
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const next = searchParams.get('next') || '/';

        console.log("Confirmation parameters:", { token_hash, type, next });

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) throw error;

          toast({
            title: "¡Email verificado!",
            description: "Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.",
          });
          
          navigate('/login');
        }
      } catch (error: any) {
        console.error("Email confirmation error:", error);
        toast({
          variant: "destructive",
          title: "Error en la verificación",
          description: error.message,
        });
        navigate('/signup');
      } finally {
        setVerifying(false);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          {verifying ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Verificando email...</h2>
              <p className="text-gray-600">
                Por favor, espera mientras verificamos tu dirección de email.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Verificación completada</h2>
              <p className="text-gray-600">
                Puedes cerrar esta ventana y volver a la página de inicio de sesión.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmailConfirmation;