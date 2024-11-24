import { Header } from "@/components/Header";
import { SignupForm } from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6">Crear cuenta</h2>
          <SignupForm />
        </div>
      </main>
    </div>
  );
};

export default Signup;