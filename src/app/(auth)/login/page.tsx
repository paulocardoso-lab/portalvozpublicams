"use client";

import React from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import { BrandLogo } from '@/components/shared/BrandLogo';

export default function MobileLogin() {
  const [email, setEmail] = React.useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await signIn("resend", { email, callbackUrl: "/admin" });
  };

  const handleOAuthLogin = (provider: "google" | "apple") => {
    signIn(provider, { callbackUrl: "/admin" });
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg max-w-[480px] mx-auto border-x border-vp-border">
      <div className="flex items-center px-4 py-3 justify-between">
        <Link href="/" className="bg-transparent border-none text-vp-text text-[20px] cursor-pointer hover:text-vp-accent no-underline">×</Link>
        <Link href="/" className="no-underline">
          <BrandLogo size="md" />
        </Link>
        <span className="w-[18px]" />
      </div>

      <div className="flex-1 px-5 py-5 pb-6 flex flex-col">
        <div className="mb-7">
          <span className="eyebrow text-[10px]">Bem-vindo de volta</span>
          <h1 className="font-display text-[32px] leading-[1.05] my-2 tracking-[-0.015em]">Entre na sua conta</h1>
          <p className="font-serif text-[14px] text-vp-text-2">Para acessar o painel administrativo, comentar e gerenciar seu apoio.</p>
        </div>

        <form onSubmit={handleEmailLogin} className="grid gap-3 mb-[18px]">
          <div>
            <label className="eyebrow block mb-1.5 text-[10px]">E-mail</label>
            <input 
              className="vp-input w-full" 
              type="email" 
              placeholder="seu@email.com.br" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="vp-btn vp-btn-primary w-full p-3.5 text-[13px]">
            Receber link de acesso
          </button>
        </form>

        <div className="flex items-center gap-2.5 my-1.5 mb-4">
          <div className="flex-1 h-[1px] bg-vp-border" />
          <span className="text-[10px] text-vp-text-3 uppercase tracking-[0.1em]">ou</span>
          <div className="flex-1 h-[1px] bg-vp-border" />
        </div>

        <div className="grid gap-2">
          <button 
            onClick={() => handleOAuthLogin("google")}
            className="vp-btn p-3 text-[12px] justify-center w-full flex items-center gap-2"
          >
            Continuar com Google
          </button>
          <button 
            onClick={() => handleOAuthLogin("apple")}
            className="vp-btn p-3 text-[12px] justify-center w-full flex items-center gap-2"
          >
            Continuar com Apple
          </button>
        </div>

        <div className="mt-auto text-center pt-6 text-[13px] text-vp-text-2">
          Não tem conta? <Link href="/signup" className="text-vp-accent font-semibold cursor-pointer hover:underline no-underline">Cadastre-se grátis</Link>
        </div>
      </div>
    </div>
  );
}
