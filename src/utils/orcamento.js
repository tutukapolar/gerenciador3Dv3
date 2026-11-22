export function formatarBRL(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function escaparHtml(texto = '') {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function abrirOrcamentoParaImpressao({ calcData, resultadoCalculo, email }) {
  const janela = window.open('', '_blank', 'width=900,height=1000');
  if (!janela) return false;

  const hoje = new Date().toLocaleDateString('pt-BR');
  const nomeItem = escaparHtml(calcData.nomeItem || 'Peça impressa em 3D');
  const quantidade = Number(resultadoCalculo.qtdPecas || 1);
  const tempo = `${resultadoCalculo.tempoTotalH || 0} h`;
  const material = `${resultadoCalculo.pesoOuVolumeTotal || 0}${resultadoCalculo.unidadeMedida || 'g'}`;

  janela.document.write(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Orçamento - ${nomeItem}</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#eef2ff;color:#0f172a;font-family:Inter,Arial,sans-serif}.page{max-width:820px;margin:32px auto;background:#fff;padding:42px;box-shadow:0 12px 40px rgba(15,23,42,.12);border-radius:18px}.top{display:flex;justify-content:space-between;gap:24px;border-bottom:2px solid #e2e8f0;padding-bottom:24px}.brand{font-size:26px;font-weight:800;color:#4338ca}.muted{color:#64748b;font-size:12px}.title{font-size:28px;font-weight:800;margin:30px 0 8px}.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px;margin-top:18px}.row{display:flex;justify-content:space-between;gap:18px;padding:10px 0;border-bottom:1px solid #e2e8f0}.row:last-child{border-bottom:0}.total{display:flex;justify-content:space-between;align-items:center;background:#eef2ff;border:1px solid #c7d2fe;border-radius:14px;padding:20px;margin-top:20px}.total strong{font-size:28px;color:#4338ca}.footer{margin-top:40px;padding-top:18px;border-top:1px solid #e2e8f0}.btn{margin-top:24px;background:#4338ca;color:#fff;border:0;padding:12px 18px;border-radius:10px;font-weight:700}@media print{body{background:#fff}.page{margin:0;max-width:none;box-shadow:none;border-radius:0;padding:28px}.btn{display:none}}
</style></head><body><main class="page">
<div class="top"><div><div class="brand">3D Print Manager</div><div class="muted">Orçamento profissional de impressão 3D</div></div><div class="muted">Emitido em ${hoje}</div></div>
<div class="title">Orçamento de produção</div><div class="muted">Referência: ${nomeItem}</div>
<div class="card"><div class="row"><span>Produto / peça</span><strong>${nomeItem}</strong></div><div class="row"><span>Tecnologia</span><strong>${escaparHtml(resultadoCalculo.tipoTecnologia || 'FDM')}</strong></div><div class="row"><span>Quantidade</span><strong>${quantidade}</strong></div><div class="row"><span>Tempo total de impressão</span><strong>${tempo}</strong></div><div class="row"><span>Material estimado</span><strong>${material}</strong></div></div>
<div class="card"><div class="row"><span>Custo de produção</span><strong>${formatarBRL(resultadoCalculo.custoTotalBase)}</strong></div><div class="row"><span>Tempo de mão de obra / setup</span><strong>${resultadoCalculo.tempoMaoDeObraMin || 0} min</strong></div><div class="row"><span>Mão de obra / setup</span><strong>${formatarBRL(resultadoCalculo.custoMaoDeObra)}</strong></div><div class="row"><span>Embalagem</span><strong>${formatarBRL(resultadoCalculo.custoEmbalagem)}</strong></div></div>
<div class="total"><div><div class="muted">Valor sugerido ao cliente</div><strong>${formatarBRL(resultadoCalculo.precoVendaDireta)}</strong></div><div class="muted">Validade: 7 dias</div></div>
<div class="footer"><div class="muted">Contato / responsável: ${escaparHtml(email || '3D Print Manager')}</div><div class="muted" style="margin-top:8px">Este orçamento é uma estimativa e pode variar conforme acabamento, material e alterações solicitadas.</div></div>
<button class="btn" onclick="window.print()">Salvar / imprimir PDF</button>
</main></body></html>`);
  janela.document.close();
  janela.focus();
  window.setTimeout(() => janela.print(), 400);
  return true;
}

export function abrirWhatsAppOrcamento({ telefone, calcData, resultadoCalculo }) {
  let numero = String(telefone || '').replace(/\D/g, '');
  if (!numero) return false;
  if (numero.length === 10 || numero.length === 11) numero = `55${numero}`;

  const mensagem = [
    `Olá! Segue o orçamento da peça *${calcData.nomeItem || 'Impressão 3D'}*`,
    '',
    `Quantidade: ${resultadoCalculo.qtdPecas || 1}`,
    `Tecnologia: ${resultadoCalculo.tipoTecnologia || 'FDM'}`,
    `Tempo de produção: ${resultadoCalculo.tempoTotalH || 0} h`,
    `Valor do orçamento: *${formatarBRL(resultadoCalculo.precoVendaDireta)}*`,
    '',
    'Orçamento gerado pelo 3D Print Manager.'
  ].join('\n');

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
  return true;
}
