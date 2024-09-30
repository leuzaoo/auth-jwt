import PasswordStrenghtMeter from "../components/PasswordStrenghtMeter";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Loader, Lock, Mail, User, X, XCircle } from "lucide-react";
import Input from "../components/Input";
import { motion } from "framer-motion";
import { useState } from "react";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(name, email, password);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-neutral-50 to-neutral-200 text-transparent bg-clip-text">
            Crie sua conta
          </h2>

          <form onSubmit={handleSignUp}>
            <Input
              icon={User}
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              icon={Mail}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="flex items-center gap-2 text-sm mb-6">
                <XCircle className="text-amber-500 size-5" />
                <p className="text-amber-500 font-semibold">{error}</p>
              </div>
            )}

            <PasswordStrenghtMeter password={password} />

            <motion.button
              className="text-lg mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-700 text-white rounded-lg shadow-lg hover:from-blue-500 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Criar conta"
              )}
            </motion.button>
          </form>
        </div>
        <div className="px-8 py-4 bg- bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Você já possui uma conta?{" "}
            <Link
              to={"/login"}
              className="text-white underline hover:text-emerald-400"
            >
              Fazer login.
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default SignUpPage;
