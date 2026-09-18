/**
 * Rotas — a home e uma rota por jogo.
 *
 * `TELAS` é um `Record` completo, não um `Partial`: **acrescentar um jogo ao
 * catálogo sem escrever a tela dele não compila**. Enquanto faltavam jogos a
 * portar, aqui havia um cartaz de "em breve" e um `??` para cair nele; agora
 * que os dezesseis existem, quem garante que nenhum link leva a lugar nenhum é
 * o compilador.
 */

import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { HomeScreen } from './HomeScreen';
import { JOGOS, type JogoId } from './games';

import { VfScreen } from '../jogos/conhecimento/VfScreen';
import { SelectScreen } from '../jogos/conhecimento/SelectScreen';
import { ClozeScreen } from '../jogos/conhecimento/ClozeScreen';
import { AssociationScreen } from '../jogos/conhecimento/AssociationScreen';
import { WhoAmIScreen } from '../jogos/conhecimento/WhoAmIScreen';
import { OrderScreen } from '../jogos/conhecimento/OrderScreen';

import { QuizCategoriaScreen } from '../jogos/quiz/QuizCategoriaScreen';
import { ContraRelogioScreen } from '../jogos/quiz/ContraRelogioScreen';
import { CompetitivoScreen } from '../jogos/quiz/CompetitivoScreen';
import { DinamicoScreen } from '../jogos/competitivo/DinamicoScreen';

import { CacaPalavrasScreen } from '../jogos/palavras/CacaPalavrasScreen';
import { AnagramaScreen } from '../jogos/palavras/AnagramaScreen';
import { ForcaScreen } from '../jogos/palavras/ForcaScreen';
import { CruzadasScreen } from '../jogos/palavras/CruzadasScreen';

import { MemoriaScreen } from '../jogos/tabuleiro/MemoriaScreen';
import { BingoScreen } from '../jogos/tabuleiro/BingoScreen';

/** Jogo → tela. Um por `JogoId`, sem falta. */
const TELAS: Record<JogoId, React.ReactElement> = {
  vf: <VfScreen />,
  select: <SelectScreen />,
  cloze: <ClozeScreen />,
  association: <AssociationScreen />,
  whoami: <WhoAmIScreen />,
  order: <OrderScreen />,

  'quiz-categoria': <QuizCategoriaScreen />,
  'contra-relogio': <ContraRelogioScreen />,
  'quiz-competitivo': <CompetitivoScreen />,
  'dinamico-competitivo': <DinamicoScreen />,

  'caca-palavras': <CacaPalavrasScreen />,
  anagrama: <AnagramaScreen />,
  forca: <ForcaScreen />,
  cruzadas: <CruzadasScreen />,

  memoria: <MemoriaScreen />,
  bingo: <BingoScreen />,
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomeScreen /> },

      ...JOGOS.map((jogo) => ({
        path: `jogo/${jogo.id}`,
        element: TELAS[jogo.id],
      })),

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
