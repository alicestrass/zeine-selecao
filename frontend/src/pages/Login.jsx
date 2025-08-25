import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Eye, Mail, Lock, User, Phone } from "lucide-react";
import api from "../services/api";

export default function Login() {
    const [mode, setMode] = useState("login");

    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    // Cadastro
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);

    // Validações
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateCel(cel) {
        return cel === "" || /^\d{8,}$/.test(cel);
    }

    function validateSenha(senha) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/.test(senha);
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!validateEmail(email)) {
            setError("E-mail inválido.");
            return;
        }
        if (!validateSenha(password)) {
            setError("A senha deve ter no mínimo 6 caracteres, incluindo letras, números e símbolos.");
            return;
        }
        if (!validateCel(telefone)) {
            setError("O telefone deve conter apenas números (mínimo 8 dígitos).");
            return;
        }

        try {
            await api.post("/register", { nome, email, senha: password, telefone });
            setSuccessMessage("Cadastro realizado com sucesso! Faça o login para continuar.");
            setMode("login");
        } catch (err) {
            setError(err.response?.data?.error || "Erro ao realizar o cadastro. Tente novamente.");
        }
    }

    // Submissão do formulário 
    async function handleSubmit(e) {
        e.preventDefault();
        if (mode === "login") {
            try {
                await login(email, password);
            } catch (err) {
                setError("E-mail ou senha inválidos");
            }
        } else {
            await handleRegister(e);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Lado esquerdo */}
            <div className="hidden md:flex w-1/2 bg-[#fdf7f7] flex-col justify-center items-center p-12 relative">
                <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
                    <span className="w-8 h-8 rounded-md bg-orange-600"></span>
                    Marketplace
                </h1>
                <p className="text-gray-500 mb-6">Painel do Vendedor</p>

                <div className="bg-white shadow-md rounded-xl p-6">
                    <div className="flex flex-col gap-4">
                        <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                            📦 Gerencie seus anúncios
                        </span>
                        <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                            📈 Veja sua loja crescendo
                        </span>
                        <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                            🏷️ Acompanhe os produtos vendidos
                        </span>
                    </div>
                </div>
            </div>

            {/* Lado direito */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-12">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-2">
                        {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
                    </h2>
                    <p className="text-gray-500 mb-6">
                        {mode === 'login' ? 'Informe seu e-mail e senha para entrar' : 'Preencha os campos para criar seu acesso'}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Nome */}
                        {mode === 'cadastro' && (
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input type="text" placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500" required />
                            </div>
                        )}

                        {/* E-mail */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Seu e-mail cadastrado"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        {/* Telefone */}
                        {mode === 'cadastro' && (
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input type="tel"
                                    placeholder="Seu telefone (opcional)"
                                    value={telefone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        setTelefone(val);
                                    }}
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500" />
                            </div>
                        )}

                        {/* Senha */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Sua senha de acesso"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-orange-500"
                            />
                            <Eye
                                className="absolute right-3 top-3 text-gray-400 w-5 h-5 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

                        {/* Botão */}
                        <button
                            type="submit"
                            className="w-full bg-orange-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-orange-700 transition"
                        >
                            {mode === 'login' ? 'Acessar' : 'Cadastrar'} →
                        </button>
                    </form>

                    {/* Link cadastro */}
                    <p className="mt-6 text-center text-gray-600">
                        {mode === 'login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
                        <button type="button" onClick={() => {
                            setMode(mode === 'login' ? 'cadastro' : 'login');
                            setError(null);
                            setSuccessMessage(null);
                        }} className="text-orange-600 font-semibold ml-1 hover:underline">
                            {mode === 'login' ? 'Cadastrar' : 'Acessar'} →
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
