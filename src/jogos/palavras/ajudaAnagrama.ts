/** Move uma letra já usada antes de revelá-la, preservando a quantidade de peças. */
export function revelarNoAnagrama(
  palavra: string,
  slots: readonly (string | null)[],
  revelados: readonly number[],
): { slots: (string | null)[]; indice: number } | null {
  const indice = slots.findIndex((s, i) => s !== palavra[i] && !revelados.includes(i));
  if (indice < 0) return null;
  const novos = [...slots];
  novos[indice] = null;
  const letra = palavra[indice];
  const total = [...palavra].filter((l) => l === letra).length;
  if (novos.filter((l) => l === letra).length >= total) {
    const origem = novos.findIndex((l, i) => l === letra && !revelados.includes(i) && palavra[i] !== l);
    if (origem >= 0) novos[origem] = null;
  }
  novos[indice] = letra;
  return { slots: novos, indice };
}
