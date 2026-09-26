/** Elegibilidade de conteúdo, antes de normalizar letras para o teclado A–Z. */
export function palavraJogavel(resposta: string, maxLetras: number): string | null {
  const original = resposta.trim().normalize('NFC');
  // Não concatena expressões, nomes compostos, hífens ou apóstrofos.
  if (!/^\p{L}+$/u.test(original)) return null;
  const letras = original.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  if (!/^[A-Z]+$/.test(letras) || letras.length < 3 || letras.length > maxLetras) return null;
  if (/^(DE|DA|DO|DAS|DOS|EM|NA|NO|NAS|NOS|PARA|POR|COM|SEM|UMA|UMAS|UNS|PELO|PELA|PELOS|PELAS)$/.test(letras)) return null;
  return letras;
}
