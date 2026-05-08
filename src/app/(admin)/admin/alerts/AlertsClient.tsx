'use client';

import React, { useState } from 'react';
import { Alert, AlertType } from '@prisma/client';
import { saveAlert, toggleAlert, deleteAlert } from '@/app/actions/alert';
import { useRouter } from 'next/navigation';

export function AlertsClient({ initialAlerts }: { initialAlerts: Alert[] }) {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState<AlertType>('INFO');
  const [isActive, setIsActive] = useState(true);

  const startEdit = (alert: Alert) => {
    setEditingId(alert.id);
    setIsAdding(false);
    setMessage(alert.message);
    setLink(alert.link || '');
    setType(alert.type);
    setIsActive(alert.isActive);
  };

  const startAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    setMessage('');
    setLink('');
    setType('LIVE');
    setIsActive(true);
  };

  const cancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setSaving(true);
    
    try {
      const saved = await saveAlert({
        id: editingId || undefined,
        message,
        link,
        type,
        isActive
      });

      if (editingId) {
        setAlerts(alerts.map(a => a.id === saved.id ? saved : (saved.isActive ? { ...a, isActive: false } : a)));
      } else {
        setAlerts([saved, ...alerts.map(a => saved.isActive ? { ...a, isActive: false } : a)]);
      }
      cancel();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar alerta');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleAlert(id, current);
      setAlerts(alerts.map(a => {
        if (a.id === id) return { ...a, isActive: !current };
        if (!current) return { ...a, isActive: false }; // desativa os outros se este foi ativado
        return a;
      }));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este alerta?')) return;
    try {
      await deleteAlert(id);
      setAlerts(alerts.filter(a => a.id !== id));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid gap-6">
      {!isAdding && !editingId && (
        <button onClick={startAdd} className="vp-btn vp-btn-primary w-max">
          + Criar Novo Alerta
        </button>
      )}

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-vp-surface border border-vp-border p-6 grid gap-4">
          <h3 className="font-display text-[18px] mb-2">{isAdding ? 'Novo Alerta' : 'Editar Alerta'}</h3>
          
          <div>
            <label className="block text-[12px] uppercase tracking-[0.1em] text-vp-text-2 mb-2 font-bold" title="Mensagem">Mensagem</label>
            <input 
              type="text" 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              className="vp-input w-full" 
              placeholder="Ex: Acompanhe a sessão extraordinária..."
              required
              maxLength={120}
              title="Mensagem"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] uppercase tracking-[0.1em] text-vp-text-2 mb-2 font-bold" title="Link">Link (Opcional)</label>
              <input 
                type="text" 
                value={link} 
                onChange={e => setLink(e.target.value)} 
                className="vp-input w-full" 
                placeholder="Ex: /ao-vivo"
                title="Link"
              />
            </div>
            <div>
              <label className="block text-[12px] uppercase tracking-[0.1em] text-vp-text-2 mb-2 font-bold" title="Tipo">Tipo (Tag)</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as AlertType)} 
                className="vp-input w-full"
                title="Tipo"
              >
                <option value="LIVE">AO VIVO (Vermelho)</option>
                <option value="BREAKING">URGENTE (Amarelo)</option>
                <option value="INFO">AVISO (Cinza)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="isActive" 
              checked={isActive} 
              onChange={e => setIsActive(e.target.checked)} 
              title="Status"
            />
            <label htmlFor="isActive" className="text-[14px]">Ativar imediatamente (desativa outros alertas)</label>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={saving} className="vp-btn vp-btn-primary">
              {saving ? 'Salvando...' : 'Salvar Alerta'}
            </button>
            <button type="button" onClick={cancel} disabled={saving} className="vp-btn">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {alerts.length === 0 && <p className="text-vp-text-3 italic">Nenhum alerta cadastrado.</p>}
        {alerts.map(alert => (
          <div key={alert.id} className={`flex items-center justify-between p-4 border ${alert.isActive ? 'border-vp-accent bg-[#2a1a1a]' : 'border-vp-border bg-vp-surface'}`}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-[10px] uppercase font-bold tracking-[0.1em] px-2 py-0.5 rounded-sm ${
                  alert.type === 'LIVE' ? 'bg-[#ff3333] text-white' : 
                  alert.type === 'BREAKING' ? 'bg-[#ffaa00] text-black' : 'bg-[#444] text-white'
                }`}>
                  {alert.type}
                </span>
                {alert.isActive && <span className="text-[11px] text-vp-accent animate-pulse font-bold">● ATIVO AGORA</span>}
              </div>
              <h4 className="font-sans text-[15px] font-semibold">{alert.message}</h4>
              {alert.link && <p className="text-[12px] text-vp-text-3 mt-1">Link: {alert.link}</p>}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleToggle(alert.id, alert.isActive)} 
                className="px-3 py-1 text-[12px] border border-vp-border hover:border-vp-accent hover:text-vp-accent transition-colors"
              >
                {alert.isActive ? 'Desativar' : 'Ativar'}
              </button>
              <button 
                onClick={() => startEdit(alert)} 
                className="px-3 py-1 text-[12px] border border-vp-border hover:border-vp-accent transition-colors"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(alert.id)} 
                className="px-3 py-1 text-[12px] border border-[#ff3333] text-[#ff3333] hover:bg-[#ff3333] hover:text-white transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
