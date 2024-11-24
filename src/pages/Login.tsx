import { Header } from "@/components/Header";
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;