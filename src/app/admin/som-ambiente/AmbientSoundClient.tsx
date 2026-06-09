'use client';

import React, { useState, useRef, useTransition } from 'react';
import { uploadAudioFile } from '@/app/actions/audio';
import { saveBatchSettings } from '@/app/actions/settings';

interface Props {
  initialEnabled: boolean;
  initialAudioUrl: string;
  initialVolume: number;
}

export function AmbientSoundClient({ initialEnabled, initialAudioUrl, initialVolume }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [audioUrl, setAudioUrl] = useState(initialAudioUrl);
  const [volume, setVolume] = useState(initialVolume);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadAudioFile(fd, 'ambient');
      if (result.error) {
        setUploadError(result.error);
      } else if (result.url) {
        setAudioUrl(result.url);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro ao enviar áudio.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      await saveBatchSettings({
        'ambient.enabled':   String(enabled),
        'ambient.audio_url': audioUrl.trim(),
        'ambient.volume':    String(volume),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Status card */}
      <div className={`flex items-center justify-between p-4 border rounded-sm ${enabled ? 'border-vp-ok/40 bg-vp-ok/5' : 'border-vp-border bg-vp-surface'}`}>
        <div>
          <p className="text-[13px] font-semibold text-vp-text">
            {enabled ? 'Som ambiente ativo' : 'Som ambiente desativado'}
          </p>
          <p className="text-[11px] text-vp-text-3 mt-0.5">
            {enabled ? 'O player será exibido no site para os leitores.' : 'Nenhum som será reproduzido no site.'}
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-[12px] text-vp-text-3 font-medium">{enabled ? 'Ligado' : 'Desligado'}</span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled(v => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors border ${enabled ? 'bg-vp-ok border-vp-ok' : 'bg-vp-surface-2 border-vp-border'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </label>
      </div>

      {/* Áudio */}
      <section className="bg-vp-surface border border-vp-border rounded-sm p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-3">Arquivo de Áudio</h3>

          <div className="flex flex-col gap-2">
            <label className="grid gap-1">
              <span className="text-[11px] font-semibold text-vp-text-3 uppercase tracking-wider">URL direta (MP3, OGG, WAV)</span>
              <input
                type="text"
                className="vp-input text-[13px] font-mono"
                placeholder="https://... /ambient.mp3"
                value={audioUrl}
                onChange={e => setAudioUrl(e.target.value)}
                title="URL do arquivo de áudio ambiente"
              />
              <span className="text-[10px] text-vp-text-4">
                Loop contínuo · recomendado MP3 ~2–4 min, 128 kbps, &lt;10 MB
              </span>
            </label>

            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px bg-vp-border" />
              <span className="text-[10px] text-vp-text-4 font-bold uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-vp-border" />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              title="Arquivo de áudio para som ambiente"
              accept="audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/mp4,audio/aac,.mp3,.ogg,.wav,.m4a,.aac"
              className="hidden"
              onChange={handleUpload}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="vp-btn w-full py-2.5 text-[12px] font-semibold flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="animate-spin text-[14px]">↻</span>
                  Enviando arquivo...
                </>
              ) : (
                <>
                  <span className="text-[14px]">↑</span>
                  Enviar arquivo de áudio
                </>
              )}
            </button>
            {uploadError && (
              <p className="text-[11px] text-vp-urgent mt-1">{uploadError}</p>
            )}

            {audioUrl && (
              <div className="mt-2 p-3 border border-vp-border rounded-sm bg-vp-bg">
                <p className="text-[10px] text-vp-text-4 uppercase font-bold tracking-wider mb-1.5">Prévia</p>
                <audio
                  controls
                  src={audioUrl}
                  className="w-full h-8"
                  style={{ accentColor: 'var(--vp-accent)' }}
                >
                  Seu navegador não suporta o player de áudio.
                </audio>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Volume */}
      <section className="bg-vp-surface border border-vp-border rounded-sm p-5">
        <h3 className="text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-4">Volume Padrão</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-vp-text-2">Volume ao iniciar</span>
            <span className="text-[15px] font-mono font-bold text-vp-accent">{volume}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-full accent-vp-accent"
            title="Volume padrão do som ambiente"
          />
          <div className="flex justify-between text-[10px] text-vp-text-4">
            <span>Mínimo (1%)</span>
            <span>Máximo (30%)</span>
          </div>
          <p className="text-[11px] text-vp-text-4 italic">
            Limitado a 30% para não sobrepor a leitura. O leitor pode ajustar no controle flutuante.
          </p>
        </div>
      </section>

      {/* Info */}
      <section className="bg-vp-surface border border-vp-border rounded-sm p-5">
        <h3 className="text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-3">Como funciona</h3>
        <ul className="flex flex-col gap-2 text-[12px] text-vp-text-3 leading-relaxed">
          <li className="flex gap-2"><span className="text-vp-accent shrink-0">→</span> O visitante vê um toast perguntando se deseja ouvir o som.</li>
          <li className="flex gap-2"><span className="text-vp-accent shrink-0">→</span> Se aceitar, o áudio toca em loop com o volume configurado acima.</li>
          <li className="flex gap-2"><span className="text-vp-accent shrink-0">→</span> Um botão flutuante no canto inferior direito permite pausar e ajustar o volume.</li>
          <li className="flex gap-2"><span className="text-vp-accent shrink-0">→</span> A escolha do visitante é salva por 30 dias no navegador.</li>
          <li className="flex gap-2"><span className="text-vp-accent shrink-0">→</span> O som pausa automaticamente quando um podcast começa a tocar.</li>
        </ul>
      </section>

      {/* Salvar */}
      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="vp-btn vp-btn-primary px-8 py-2.5 text-[13px] font-semibold"
        >
          {isPending ? 'Salvando...' : saved ? '✓ Configurações salvas' : 'Salvar configurações'}
        </button>
      </div>
    </div>
  );
}
