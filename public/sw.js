/**
 * Service worker do Quizzer.
 *
 * Existe por um motivo só: **o app abrir sem internet**. O banco de perguntas
 * já vive no `localStorage` desde a primeira visita (ver `bancoLoader`), mas
 * sem isto aqui o navegador ainda precisaria buscar o HTML e o JavaScript na
 * rede para chegar até ele — e no celular, no salão, a rede é o que costuma
 * faltar.
 *
 * A regra é escolhida por tipo de pedido, e cada escolha tem uma razão:
 *
 * - **Navegação: rede primeiro.** É o pedido que decide qual versão do app
 *   roda. Guardá-lo em cache faria um deploy novo levar dias para chegar em
 *   quem já usou. Sem rede, cai no `index.html` guardado.
 * - **Arquivos de /assets: cache primeiro.** Eles têm o hash do conteúdo no
 *   nome — mudou o conteúdo, mudou o nome —, então uma cópia guardada nunca
 *   está velha. Um arquivo novo simplesmente não está no cache e vem da rede.
 * - **Firebase: nunca.** O banco tem a própria política de cache, com versão.
 *   Duas camadas guardando a mesma coisa é como um dado velho vira eterno.
 */

const VERSAO = 'quizzer-v1';
const CASCA = ['/', '/index.html', '/manifest.webmanifest', '/icone.svg', '/icone-192.png'];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(VERSAO)
      .then((cache) => cache.addAll(CASCA))
      // Um item da casca que falhe não pode impedir a instalação inteira.
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(chaves.filter((c) => c !== VERSAO).map((c) => caches.delete(c))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (evento) => {
  const pedido = evento.request;
  if (pedido.method !== 'GET') return;

  const url = new URL(pedido.url);
  if (url.origin !== self.location.origin) return;

  if (pedido.mode === 'navigate') {
    evento.respondWith(
      fetch(pedido)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(VERSAO).then((cache) => cache.put('/index.html', copia));
          return resposta;
        })
        .catch(() => caches.match('/index.html').then((r) => r ?? Response.error())),
    );
    return;
  }

  evento.respondWith(
    caches.match(pedido).then((guardado) => {
      if (guardado) return guardado;
      return fetch(pedido).then((resposta) => {
        if (resposta.ok && resposta.type === 'basic') {
          const copia = resposta.clone();
          caches.open(VERSAO).then((cache) => cache.put(pedido, copia));
        }
        return resposta;
      });
    }),
  );
});
