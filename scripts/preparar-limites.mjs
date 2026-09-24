// Emite um patch, sem gravar o banco. Os limites são conservadores: números
// comprovados pelas referências já cadastradas, não a extensão total da Bíblia.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const caminho = resolve(process.argv[2]);
const banco = JSON.parse(readFileSync(caminho, 'utf8'));
if (banco.banco.trechos.limitesConfirmados) throw new Error('O banco já contém limitesConfirmados; nenhum patch foi produzido.');
const limites = {};
for (const item of banco.banco.trechos.items) {
  const match = item.referencia.match(/^(.+?) (\d+:.*)$/);
  if (!match) throw new Error(`Referência inválida: ${item.referencia}`);
  const livro = match[1] === 'Salmo' ? 'Salmos' : match[1];
  const limite = limites[livro] ??= { capitulosAte: 0, versiculosAte: {} };
  for (const parte of match[2].split(';')) {
    const [capitulo, versiculos] = parte.trim().split(':');
    const numeros = versiculos.match(/\d+/g).map(Number);
    limite.capitulosAte = Math.max(limite.capitulosAte, Number(capitulo));
    limite.versiculosAte[capitulo] = Math.max(limite.versiculosAte[capitulo] ?? 0, ...numeros);
  }
}
const linhas = JSON.stringify(limites, null, 2).split('\n').map((l) => `      ${l}`);
linhas[0] = '      "limitesConfirmados": {';
linhas[linhas.length - 1] += ',';
console.log(`*** Begin Patch\n*** Update File: ${caminho}\n@@\n     "trechos": {\n${linhas.map((l) => '+' + l).join('\n')}\n       "metadata": {\n*** End Patch`);
