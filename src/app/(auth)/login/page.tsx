"use client";

import React from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Eyebrow } from '@/components/shared/Eyebrow';

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{type: 'success' | 'error', text: string} | null>(null);
  const [password, setPassword] = React.useState("");
  const [showMaster, setShowMaster] = React.useState(false);

  const superEmail = "paulofernadogarciacardoso@gmail.com";

  React.useEffect(() => {
    if (email.toLowerCase() === superEmail.toLowerCase()) {
      setShowMaster(true);
    } else {
      setShowMaster(false);
    }
  }, [email]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      if (showMaster && password) {
        // Login via Credentials (Master Key)
        const result = await signIn("credentials", {
          email,
          password,
          callbackUrl: "/admin",
          redirect: false
        });

        if (result?.error) {
          setMessage({ type: 'error', text: 'Chave Mestra incorreta.' });
        } else {
          window.location.href = "/admin";
        }
      } else {
        // Login via Magic Link
        const result = await signIn("resend", { 
          email, 
          callbackUrl: "/eu",
          redirect: false 
        });

        if (result?.error) {
          setMessage({ type: 'error', text: 'Erro ao enviar e-mail. Verifique a configuração do serviço.' });
        } else {
          setMessage({ type: 'success', text: 'Link enviado! Verifique sua caixa de entrada.' });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: "google") => {
    signIn(provider, { callbackUrl: "/eu" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      {/* Auth Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-vp-border">
        <Link href="/">
           <BrandLogo size="md" />
        </Link>
        <Link href="/" className="text-[24px] text-vp-text-3 hover:text-vp-text transition-colors">×</Link>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-vp-bg">
        <div className="max-w-[440px] w-full bg-vp-bg lg:border lg:border-vp-border lg:shadow-2xl">
          <div className="p-6 lg:p-10">
            <div className="mb-8 text-center lg:text-left">
              <Eyebrow className="text-[10px]">Bem-vindo de volta</Eyebrow>
              <h1 className="font-display text-[32px] lg:text-[38px] leading-[1.05] my-3 tracking-tight font-black">
                Entre na sua conta.
              </h1>
              <p className="font-serif text-[15px] text-vp-text-2 leading-relaxed">
                Para comentar, salvar matérias e gerenciar seu apoio ao jornalismo independente.
              </p>
            </div>

            {message && (
              <div className={`mb-8 p-4 border text-[13px] font-bold leading-tight ${
                message.type === 'success' ? 'bg-vp-ok/10 border-vp-ok text-vp-ok' : 'bg-vp-urgent/10 border-vp-urgent text-vp-urgent'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="eyebrow block mb-2 text-[10px]">E-mail</label>
                <input 
                  className="vp-input w-full py-3.5 px-4" 
                  type="email" 
                  placeholder="seu@email.com.br" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {showMaster && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="eyebrow block mb-2 text-[10px]">Chave Mestra (Superadm)</label>
                  <input 
                    className="vp-input w-full py-3.5 px-4 border-vp-accent" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-[11px] text-vp-accent mt-2 font-bold italic">
                    Acesso direto habilitado para Superadm.
                  </p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="vp-btn vp-btn-primary w-full py-4 text-[13px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {isLoading ? 'Autenticando...' : (showMaster && password ? 'Entrar Agora →' : 'Receber link de acesso →')}
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-[1px] bg-vp-border" />
              <span className="text-[10px] text-vp-text-4 uppercase tracking-[0.2em] font-black">ou</span>
              <div className="flex-1 h-[1px] bg-vp-border" />
            </div>

            <div className="grid gap-3">
              <button 
                onClick={() => handleOAuthLogin("google")}
                className="vp-btn w-full py-3.5 text-[12px] font-bold flex items-center justify-center gap-3 hover:bg-vp-surface transition-all"
              >
                <span>G</span> Continuar com Google
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-vp-border text-center text-[13px] text-vp-text-3">
              Ainda não tem conta? <Link href="/signup" className="text-vp-accent font-bold hover:underline ml-1">Cadastre-se grátis</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-[10px] text-vp-text-4 font-mono uppercase tracking-widest bg-vp-bg border-t border-vp-border">
        Voz Pública MS · 2026
      </footer>
    </div>
  );
}

