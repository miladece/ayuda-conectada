import { Header } from "@/components/Header";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>
          <LoginForm />
          <div className="text-center space-y-4">
            <p className="text-gray-600">¿No tienes una cuenta?</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/signup')}
              className="w-full"
            >
              Registrarse
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;