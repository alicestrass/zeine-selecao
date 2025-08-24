import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/produtos'); // Redireciona para a lista de produtos após o login
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        }
    };

    return (
        // Aqui você constrói o JSX com base no design do Figma.
        // Use divs, classes de CSS, etc.
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h2>Acesse sua conta</h2>
                <input
                    type="email"
                    placeholder="Seu e-mail cadastrado"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Sua senha de acesso"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Acessar</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Login;