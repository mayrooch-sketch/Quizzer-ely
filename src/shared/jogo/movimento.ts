/**
 * Quem pediu menos movimento no sistema recebe menos movimento aqui.
 *
 * O CSS já corta transições e animações sozinho (ver `tokens.css`), mas há
 * movimento que o CSS não alcança: o tremor do dado é um `setInterval` trocando
 * a face, e a espera de 700ms antes de a regra aparecer é uma pausa que só
 * existe por causa da animação. Sem animação, a pausa vira atraso à toa.
 */
export function semMovimento(): boolean {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
