import { useCallback, useEffect, useRef, useState } from 'react';

/** O tempo real passa mesmo com a aba suspensa; o moderador decide o resultado. */
export function useRelogioModerador() {
  const [segundos, setSegundos] = useState<number | null>(null);
  const [rodando, setRodando] = useState(false);
  const restante = useRef(0);
  const limite = useRef(0);
  const ativo = useRef(false);
  const definir = useCallback((valor: number | null) => {
    ativo.current = false;
    setRodando(false);
    restante.current = (valor ?? 0) * 1000;
    limite.current = Date.now() + restante.current;
    setSegundos(valor);
  }, []);
  const rodar = useCallback((valor: boolean | ((atual: boolean) => boolean)) => {
    const novo = typeof valor === 'function' ? valor(ativo.current) : valor;
    if (novo && !ativo.current) limite.current = Date.now() + restante.current;
    if (!novo && ativo.current) restante.current = Math.max(0, limite.current - Date.now());
    ativo.current = novo;
    setRodando(novo);
  }, []);
  useEffect(() => {
    if (!rodando) return;
    const id = setInterval(() => {
      restante.current = Math.max(0, limite.current - Date.now());
      setSegundos(Math.ceil(restante.current / 1000));
      if (!restante.current) { ativo.current = false; setRodando(false); }
    }, 100);
    return () => clearInterval(id);
  }, [rodando]);
  return { segundos, setSegundos: definir, rodando, setRodando: rodar };
}
