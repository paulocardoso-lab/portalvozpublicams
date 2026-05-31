'use client';

import React, { useRef, useState, useCallback } from 'react';
import { uploadBrand } from '@/app/actions/brand';

interface BrandUploaderProps {
  type: 'logo' | 'favicon';
  currentUrl: string;
  label: string;
  hint: string;
  /** width × height recommendation string e.g. "Qualquer proporção, mín. 200×50px" */
  dimensionHint: string;
  onSuccess: (url: string) => void;
}

const ACCEPTED = 'image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml';
const MAX_MB = 5;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export function BrandUploader({
  type,
  currentUrl,
  label,
  hint,
  dimensionHint,
  onSuccess,
}: BrandUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentUrl);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setErrorMsg('');

    // Client-side pre-validation
    const validTypes = ACCEPTED.split(',');
    if (!validTypes.includes(file.type)) {
      setErrorMsg(`Formato não aceito: ${file.type || 'desconhecido'}. Use PNG, JPG, WebP, GIF ou SVG.`);
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErrorMsg(`Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo: ${MAX_MB} MB.`);
      return;
    }

    // Instant preview from local file
    const dataUrl = await readAsDataUrl(file);
    setPreview(dataUrl);
    setStatus('loading');

    try {
      const fd = new FormData();
      fd.append('file', file);
      const url = await uploadBrand(fd, type);
      setPreview(url);
      setStatus('ok');
      onSuccess(url);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido no upload.');
      setStatus('error');
      setPreview(currentUrl); // revert
    }
  }, [type, currentUrl, onSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const isFavicon = type === 'favicon';

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[11px] font-black uppercase tracking-widest text-vp-text-4">{label}</div>
        <div className="text-[12px] text-vp-text-3 font-serif italic mt-0.5">{hint}</div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Preview box */}
        <div
          className={`flex-shrink-0 border border-vp-border bg-vp-surface rounded-sm flex items-center justify-center overflow-hidden ${
            isFavicon ? 'w-16 h-16' : 'w-40 h-14'
          }`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={label}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-[10px] text-vp-text-4 italic">sem imagem</span>
          )}
        </div>

        {/* Drop zone + button */}
        <div className="flex-1 space-y-3">
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-sm px-4 py-5 text-center transition-colors ${
              dragOver
                ? 'border-vp-accent bg-vp-accent/5'
                : 'border-vp-border hover:border-vp-accent/50 hover:bg-vp-surface/50'
            }`}
          >
            <div className="text-[13px] font-bold text-vp-text-2">
              {status === 'loading' ? 'Enviando...' : 'Clique ou arraste aqui'}
            </div>
            <div className="text-[11px] text-vp-text-4 mt-1">
              PNG · JPG · WebP · GIF · SVG · máx. {MAX_MB} MB
            </div>
            <div className="text-[10px] text-vp-text-4 mt-0.5 italic">{dimensionHint}</div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={handleInputChange}
            title={`Selecionar ${label}`}
          />

          {/* Status indicator */}
          {status === 'loading' && (
            <div className="flex items-center gap-2 text-[12px] text-vp-text-4 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-vp-accent inline-block" />
              Processando com Sharp e enviando ao Supabase...
            </div>
          )}
          {status === 'ok' && (
            <div className="flex items-center gap-2 text-[12px] text-vp-ok font-bold">
              <span>✓</span> Salvo e aplicado com sucesso
            </div>
          )}
          {status === 'error' && (
            <div className="text-[12px] text-vp-urgent font-bold">
              ✕ {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* Conversion note */}
      <div className="text-[10px] text-vp-text-4 border-l-2 border-vp-border pl-2.5 leading-relaxed">
        {isFavicon
          ? 'Convertido automaticamente para PNG 512×512 (fundo transparente). O browser escolhe o tamanho adequado.'
          : 'Convertido automaticamente para WebP (altura máx. 400 px, qualidade 90%). A proporção original é preservada.'}
      </div>
    </div>
  );
}
