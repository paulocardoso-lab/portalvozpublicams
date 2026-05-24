"use client";

import React from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Eyebrow } from '@/components/shared/Eyebrow';

type Mode = 'password' | 'magic';

export default function LoginPage() {
  const [mode, setMode] = React.useState<Mode>('password');
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/admin",
        redirect: false,
      });
      if (result?.error) {
        setMessage({ type: 'error', text: 'E-mail ou senha incorretos.' });
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const result = await signIn("resend", {
        email,
        callbackUrl: "/eu",
        redirect: false,
      });
      if (result?.error) {
        setMessage({ type: 'error', text: 'Erro ao enviar e-mail. Verifique o endereço.' });
      } else {
        setMessage({ type: 'success', text: 'Link enviado! Verifique sua caixa de entrada.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-vp-border">
        <Link href="/"><BrandLogo size="md" /></Link>
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

            {/* Toggle de modo */}
            <div className="flex mb-8 border border-vp-border">
              <button
                type="button"
                onClick={() => { setMode('password'); setMessage(null); }}
                className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest transition-colors ${
                  mode === 'password' ? 'bg-vp-accent text-white' : 'text-vp-text-3 hover:text-vp-text'
                }`}
              >
                Senha
              </button>
              <button
                type="button"
                onClick={() => { setMode('magic'); setMessage(null); }}
                className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest transition-colors ${
                  mode === 'magic' ? 'bg-vp-accent text-white' : 'text-vp-text-3 hover:text-vp-text'
                }`}
              >
                Link por e-mail
              </button>
            </div>

            {message && (
              <div className={`mb-6 p-4 border text-[13px] font-bold leading-tight ${
                message.type === 'success'
                  ? 'bg-vp-ok/10 border-vp-ok text-vp-ok'
                  : 'bg-vp-urgent/10 border-vp-urgent text-vp-urgent'
              }`}>
                {message.text}
              </div>
            )}

            {mode === 'password' ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                <div>
                  <label className="eyebrow block mb-2 text-[10px]">Senha</label>
                  <input
                    className="vp-input w-full py-3.5 px-4"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="vp-btn vp-btn-primary w-full py-4 text-[13px] font-black uppercase tracking-widest disabled:opacity-50"
                >
                  {isLoading ? 'Entrando...' : 'Entrar →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
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
                <button
                  type="submit"
                  disabled={isLoading}
                  className="vp-btn vp-btn-primary w-full py-4 text-[13px] font-black uppercase tracking-widest disabled:opacity-50"
                >
                  {isLoading ? 'Enviando...' : 'Receber link de acesso →'}
                </button>
                <p className="text-[11px] text-vp-text-4 text-center leading-relaxed">
                  Você receberá um link seguro no seu e-mail.<br/>Sem necessidade de senha.
                </p>
              </form>
            )}

            <div className="mt-10 pt-6 border-t border-vp-border text-center text-[13px] text-vp-text-3">
              Ainda não tem conta?{' '}
              <Link href="/signup" className="text-vp-accent font-bold hover:underline ml-1">
                Cadastre-se grátis
              </Link>
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
