import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FloatingShape from "./components/FloatingShape";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

// Direciona o usuário para tela de login caso não esteja logado ou para tela de confirmação de email, caso não tenha confirmado o email
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  if (!user.isVerified) {
    return <Navigate to={"/verify-email"} replace />;
  }

  return children;
};

// Redireciona os usuários para a homepage caso ele esteja logado e seja verificado
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, authCheck, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  console.log("autenticado", isAuthenticated);
  console.log("user", user);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-sky-500 flex items-center justify-center relative overflow-hidden">
        <FloatingShape
          color="bg-white"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-white"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-white"
          size="w-32 h-32"
          top="40%"
          left="-10%"
          delay={2}
        />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/verify-email"
            element={
              <RedirectAuthenticatedUser>
                <VerifyEmailPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
