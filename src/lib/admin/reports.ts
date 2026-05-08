/**
 * generateCSV — Utilitário para exportação de dados para anunciantes e gestores.
 */
export function generateCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(header => JSON.stringify(obj[header] || '')).join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * generateCampaignReport — Formata dados de campanha para exportação.
 */
export function generateCampaignReport(campaigns: any[]) {
  const reportData = campaigns.map(c => ({
    Campanha: c.name,
    Cliente: c.client,
    Slot: c.slot,
    Impressoes: c.impressions,
    Cliques: c.clicks,
    CTR: c.ctr,
    Status: c.status,
    Fim_da_Campanha: c.endsAt
  }));

  generateCSV(reportData, `Relatorio_Publicidade_${new Date().toISOString().split('T')[0]}`);
}
