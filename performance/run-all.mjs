// Executa os 3 cenários k6 em sequência, mesmo que um deles reprove nas metas (thresholds),
// salva a saída de cada um em docs/qa/evidencias/k6/ e informa o resultado no final.
// Uso: npm run perf:all (com a aplicação rodando) ou npm run test:perf (sobe a aplicação).
import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync } from 'node:fs';

const EVIDENCIAS = 'docs/qa/evidencias/k6';
const CENARIOS = [
  ['perf-01', 'perf-01-smoke.js'],
  ['perf-02', 'perf-02-carga-login.js'],
  ['perf-03', 'perf-03-jornada-compra.js']
];

mkdirSync(EVIDENCIAS, { recursive: true });

function executar([id, arquivo]) {
  return new Promise((resolve) => {
    const saida = createWriteStream(`${EVIDENCIAS}/${id}-saida.txt`);
    const k6 = spawn(
      'k6',
      [
        'run',
        '--summary-export', `${EVIDENCIAS}/${id}-resumo.json`,
        '--out', `web-dashboard=export=${EVIDENCIAS}/${id}-dashboard.html`,
        `performance/${arquivo}`
      ],
      { shell: process.platform === 'win32' }
    );
    for (const stream of [k6.stdout, k6.stderr]) {
      stream.on('data', (chunk) => {
        process.stdout.write(chunk);
        saida.write(chunk);
      });
    }
    k6.on('error', (erro) => {
      console.error(`\nNão foi possível executar o k6: ${erro.message}. O k6 está instalado e no PATH?`);
      saida.end();
      resolve({ id, codigo: -1 });
    });
    k6.on('close', (codigo) => saida.end(() => resolve({ id, codigo })));
  });
}

const resultados = [];
for (const cenario of CENARIOS) resultados.push(await executar(cenario));

// Código 99 = o k6 executou, mas alguma meta (threshold) foi reprovada
const descricao = (c) => (c === 0 ? '✅ metas atendidas' : c === 99 ? '❌ meta(s) reprovada(s)' : `⚠️ erro na execução (código ${c})`);
console.log('\nResumo da performance:');
for (const { id, codigo } of resultados) console.log(`  ${id}: ${descricao(codigo)}`);

process.exitCode = resultados.every((r) => r.codigo === 0) ? 0 : 1;
