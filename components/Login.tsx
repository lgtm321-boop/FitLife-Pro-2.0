import React, { useState } from 'react';
import { Button } from './Button';
import { authService } from '../services/authService';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (!formData.email || !formData.password) throw new Error('Preencha todos os campos obrigatórios');
      
      let user: User;
      if (isRegistering) {
        if (!formData.name) throw new Error('Digite seu nome completo');
        user = authService.register(formData.email.toLowerCase(), formData.password, formData.name);
      } else {
        user = authService.login(formData.email.toLowerCase(), formData.password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      onLogin(user);
    } catch (err: any) {
      setError("Erro ao conectar com Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent relative overflow-hidden font-sans">
      {/* Background Elements - Darker and Subtler */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-surface p-8 md:p-10 rounded-3xl shadow-soft w-full max-w-md z-10 animate-slide-up border border-white/5 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" className="mb-4" />
          <p className="text-muted text-sm font-medium">Sua jornada fitness começa agora.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm text-center border border-red-500/20 animate-fade-in">
              {error}
            </div>
          )}

          {isRegistering && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-xs font-bold text-muted uppercase ml-1">Nome Completo</label>
              <div className="relative group">
                <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-input border border-white/5 rounded-xl p-3 pl-10 text-secondary focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-gray-600"
                  placeholder="Ex: João Silva"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase ml-1">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-input border border-white/5 rounded-xl p-3 pl-10 text-secondary focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-gray-600"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase ml-1">Senha</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-input border border-white/5 rounded-xl p-3 pl-10 text-secondary focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button fullWidth type="submit" disabled={isLoading} className="mt-6 h-12 text-lg">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? 'Criar Conta' : 'Entrar')}
          </Button>
        </form>
        
        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface text-muted font-medium">Ou entre com</span>
            </div>
        </div>

        <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-gray-900 border border-transparent hover:bg-gray-200 font-bold py-3 px-4 rounded-full flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70 shadow-sm"
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
                <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                    <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                    <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                    <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
                </svg>
                <span>Continuar com Google</span>
                </>
            )}
        </button>

        <div className="mt-8 text-center">
          <p className="text-muted text-sm">
            {isRegistering ? "Já tem uma conta?" : "Ainda não tem conta?"}
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="ml-2 text-primary font-bold hover:text-primary/80 transition-colors focus:outline-none"
            >
              {isRegistering ? "Fazer Login" : "Criar Cadastro"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};