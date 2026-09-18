import { prepararTrechos } from './biblioteca';
import type { TrechoBruto } from './types';

export const TRECHOS_BRUTOS = [
  {
    "id": "1-corintios-15-28",
    "trecho": "O próprio Filho também se sujeitará Àquele que lhe sujeitou todas as coisas.",
    "referencia": "1 Coríntios 15:28",
    "temas": [
      5
    ]
  },
  {
    "id": "mateus-6-10",
    "trecho": "Venha o teu Reino. Seja feita a tua vontade, como no céu, assim também na terra.",
    "referencia": "Mateus 6:10",
    "temas": [
      5
    ]
  },
  {
    "id": "mateus-5-3",
    "trecho": "Felizes os que têm consciência de sua necessidade espiritual, porque a eles pertence o Reino dos céus.",
    "referencia": "Mateus 5:3",
    "temas": [
      15
    ]
  },
  {
    "id": "mateus-26-14-15-27-5",
    "trecho": "‘O que me darão para entregá-lo a vocês? Estipularam-lhe 30 moedas de prata.",
    "referencia": "Mateus 26:14, 15; 27:5",
    "temas": [
      6
    ]
  },
  {
    "id": "mateus-24-7-8",
    "trecho": "Todas essas coisas são um começo das dores de aflição.",
    "referencia": "Mateus 24:7, 8",
    "temas": [
      7
    ]
  },
  {
    "id": "mateus-24-11-12",
    "trecho": "Por causa do aumento do que é contra a lei.",
    "referencia": "Mateus 24:11, 12",
    "temas": [
      7
    ]
  },
  {
    "id": "mateus-22-39",
    "trecho": "Ame o seu próximo como a si mesmo.",
    "referencia": "Mateus 22:39",
    "temas": [
      15
    ]
  },
  {
    "id": "mateus-2-1",
    "trecho": "Depois que Jesus nasceu em Belém da Judeia, nos dias do rei Herodes, astrólogos vindos do Oriente chegaram a Jerusalém.",
    "referencia": "Mateus 2:1",
    "temas": [
      6
    ]
  },
  {
    "id": "marcos-13-7",
    "trecho": "Quando ouvirem falar de guerras e notícias de guerras, não fiquem apavorados.",
    "referencia": "Marcos 13:7",
    "temas": [
      7
    ]
  },
  {
    "id": "lucas-6-31",
    "trecho": "Assim como querem que os homens façam a vocês, façam do mesmo modo a eles.",
    "referencia": "Lucas 6:31",
    "temas": [
      15
    ]
  },
  {
    "id": "lucas-21-11",
    "trecho": "As pessoas verão coisas atemorizantes e grandes sinais do céu.",
    "referencia": "Lucas 21:11",
    "temas": [
      7
    ]
  },
  {
    "id": "mateus-6-27",
    "trecho": "Quem de vocês, por estar ansioso, pode acrescentar um só côvado à duração da sua vida?",
    "referencia": "Mateus 6:27",
    "temas": [
      16
    ]
  },
  {
    "id": "lucas-14-28-30",
    "trecho": "Não se senta primeiro e calcula a despesa.",
    "referencia": "Lucas 14:28-30",
    "temas": [
      14
    ]
  },
  {
    "id": "lucas-11-28",
    "trecho": "Felizes os que ouvem a palavra de Deus e a põem em prática!",
    "referencia": "Lucas 11:28",
    "temas": [
      15
    ]
  },
  {
    "id": "josue-1-8",
    "trecho": "Este livro da Lei deve estar sempre em seus lábios.",
    "referencia": "Josué 1:8",
    "temas": [
      2
    ]
  },
  {
    "id": "joao-6-12",
    "trecho": "Juntem os pedaços que sobraram, para que nada se desperdice.",
    "referencia": "João 6:12",
    "temas": [
      14
    ]
  },
  {
    "id": "joao-5-28-29",
    "trecho": "Vem a hora em que todos os que estão nos túmulos memoriais ouvirão a voz dele e sairão.",
    "referencia": "João 5:28, 29",
    "temas": [
      12
    ]
  },
  {
    "id": "joao-19-34",
    "trecho": "Um dos soldados lhe furou o lado com uma lança, e imediatamente saiu sangue e água.",
    "referencia": "João 19:34",
    "temas": [
      6
    ]
  },
  {
    "id": "joao-19-33",
    "trecho": "Ao chegarem a Jesus, viram que ele já estava morto; por isso, não quebraram as pernas dele.",
    "referencia": "João 19:33",
    "temas": [
      6
    ]
  },
  {
    "id": "joao-19-23-24",
    "trecho": "A túnica não tinha costura, pois era tecida de alto a baixo.",
    "referencia": "João 19:23, 24",
    "temas": [
      6
    ]
  },
  {
    "id": "joao-17-3",
    "trecho": "Isto significa vida eterna: que conheçam a ti, o único Deus verdadeiro, e àquele que tu enviaste, Jesus Cristo.",
    "referencia": "João 17:3",
    "temas": [
      18
    ]
  },
  {
    "id": "joao-11-11-13-14",
    "trecho": "Eles imaginavam que estivesse falando do sono natural.",
    "referencia": "João 11:11, 13, 14",
    "temas": [
      11
    ]
  },
  {
    "id": "jo-34-10",
    "trecho": "O verdadeiro Deus jamais faria o que é mau, o Todo-Poderoso nunca faria o que é errado!",
    "referencia": "Jó 34:10",
    "temas": [
      8
    ]
  },
  {
    "id": "lucas-12-15",
    "trecho": "Mesmo quando alguém tem abundância, sua vida não vem das coisas que possui.",
    "referencia": "Lucas 12:15",
    "temas": [
      15
    ]
  },
  {
    "id": "jo-26-7",
    "trecho": "Suspende a terra sobre o nada.",
    "referencia": "Jó 26:7",
    "temas": [
      4
    ]
  },
  {
    "id": "mateus-6-34",
    "trecho": "Nunca fiquem ansiosos por causa do amanhã, pois o amanhã terá suas próprias ansiedades.",
    "referencia": "Mateus 6:34",
    "temas": [
      16
    ]
  },
  {
    "id": "neemias-8-8",
    "trecho": "Assim ajudavam o povo a entender o que estava sendo lido.",
    "referencia": "Neemias 8:8",
    "temas": [
      2
    ]
  },
  {
    "id": "tiago-1-5",
    "trecho": "Se falta sabedoria a algum de vocês, que ele persista em pedi-la a Deus.",
    "referencia": "Tiago 1:5",
    "temas": [
      2,
      18
    ]
  },
  {
    "id": "tiago-1-13",
    "trecho": "Quando estiver sob provação, que ninguém diga: Estou sendo provado por Deus.",
    "referencia": "Tiago 1:13",
    "temas": [
      8
    ]
  },
  {
    "id": "salmo-83-18",
    "trecho": "Que as pessoas saibam que tu, cujo nome é Jeová, somente tu és o Altíssimo sobre toda a terra.",
    "referencia": "Salmo 83:18",
    "temas": [
      1
    ]
  },
  {
    "id": "salmo-65-2",
    "trecho": "Ó Ouvinte de oração, a ti virão pessoas de todo tipo.",
    "referencia": "Salmo 65:2",
    "temas": [
      18
    ]
  },
  {
    "id": "salmo-55-22",
    "trecho": "Lance seu fardo sobre Jeová, e ele amparará você. Nunca permitirá que o justo venha a cair.",
    "referencia": "Salmo 55:22",
    "temas": [
      16
    ]
  },
  {
    "id": "salmo-37-29",
    "trecho": "Os justos possuirão a terra e viverão nela para sempre.",
    "referencia": "Salmo 37:29",
    "temas": [
      10
    ]
  },
  {
    "id": "salmo-34-20",
    "trecho": "Ele protege todos os seus ossos; nem mesmo um deles foi quebrado.",
    "referencia": "Salmo 34:20",
    "temas": [
      6
    ]
  },
  {
    "id": "salmo-22-18",
    "trecho": "Repartem entre si as minhas roupas e lançam sortes sobre a minha vestimenta.",
    "referencia": "Salmo 22:18",
    "temas": [
      6
    ]
  },
  {
    "id": "salmo-146-4",
    "trecho": "Seu espírito sai, e eles voltam ao solo; nesse mesmo dia os seus pensamentos se acabam.",
    "referencia": "Salmo 146:4",
    "temas": [
      11
    ]
  },
  {
    "id": "salmo-119-105",
    "trecho": "Tua palavra é lâmpada para o meu pé, e luz para o meu caminho.",
    "referencia": "Salmo 119:105",
    "temas": [
      20
    ]
  },
  {
    "id": "miqueias-5-2",
    "trecho": "De você me sairá aquele que será governante em Israel.",
    "referencia": "Miqueias 5:2",
    "temas": [
      6
    ]
  },
  {
    "id": "salmo-100-3",
    "trecho": "Saibam que Jeová é Deus. Foi ele quem nos fez, e nós pertencemos a ele.",
    "referencia": "Salmo 100:3",
    "temas": [
      1
    ]
  },
  {
    "id": "romanos-5-12",
    "trecho": "Por meio de um só homem o pecado entrou no mundo.",
    "referencia": "Romanos 5:12",
    "temas": [
      9
    ]
  },
  {
    "id": "romanos-16-20",
    "trecho": "O Deus que dá paz esmagará em breve a Satanás debaixo dos pés de vocês.",
    "referencia": "Romanos 16:20",
    "temas": [
      5
    ]
  },
  {
    "id": "romanos-10-13",
    "trecho": "Todo aquele que invocar o nome de Jeová será salvo.",
    "referencia": "Romanos 10:13",
    "temas": [
      1
    ]
  },
  {
    "id": "romanos-1-20",
    "trecho": "Porque são percebidas por meio das coisas feitas.",
    "referencia": "Romanos 1:20",
    "temas": [
      2
    ]
  },
  {
    "id": "proverbios-3-5-6",
    "trecho": "Lembre-se dele em todos os seus caminhos, e ele endireitará as suas veredas.",
    "referencia": "Provérbios 3:5, 6",
    "temas": [
      18
    ]
  },
  {
    "id": "proverbios-22-7",
    "trecho": "Quem toma emprestado é escravo de quem empresta.",
    "referencia": "Provérbios 22:7",
    "temas": [
      14
    ]
  },
  {
    "id": "proverbios-22-29",
    "trecho": "Ele tomará posição diante de reis, não diante de homens comuns.",
    "referencia": "Provérbios 22:29",
    "temas": [
      13
    ]
  },
  {
    "id": "proverbios-21-5",
    "trecho": "Os planos do diligente certamente dão bons resultados, mas todos os precipitados acabarão na pobreza.",
    "referencia": "Provérbios 21:5",
    "temas": [
      16
    ]
  },
  {
    "id": "proverbios-21-17",
    "trecho": "Quem ama a diversão ficará pobre; quem ama o vinho e o azeite não ficará rico.",
    "referencia": "Provérbios 21:17",
    "temas": [
      14
    ]
  },
  {
    "id": "proverbios-15-17",
    "trecho": "Melhor um prato de verduras onde há amor do que um boi gordo onde há ódio.",
    "referencia": "Provérbios 15:17",
    "temas": [
      15
    ]
  },
  {
    "id": "salmo-1-1-3",
    "trecho": "Feliz é o homem que não anda segundo o conselho dos maus.",
    "referencia": "Salmo 1:1-3",
    "temas": [
      2
    ]
  },
  {
    "id": "tiago-4-8",
    "trecho": "Acheguem-se a Deus, e ele se achegará a vocês. Limpem as mãos, ó pecadores, e purifiquem o coração, ó indecisos.",
    "referencia": "Tiago 4:8",
    "temas": [
      18
    ]
  },
  {
    "id": "isaias-65-21-22",
    "trecho": "Eles construirão casas e morarão nelas; plantarão vinhedos e comerão os seus frutos.",
    "referencia": "Isaías 65:21, 22",
    "temas": [
      10
    ]
  },
  {
    "id": "isaias-48-17",
    "trecho": "Aquele que o guia no caminho em que deve andar.",
    "referencia": "Isaías 48:17",
    "temas": [
      15
    ]
  },
  {
    "id": "colossenses-3-20",
    "trecho": "Filhos, em tudo sejam obedientes aos seus pais, pois isso é agradável ao Senhor.",
    "referencia": "Colossenses 3:20",
    "temas": [
      17
    ]
  },
  {
    "id": "colossenses-3-18",
    "trecho": "Esposa, esteja sujeita ao seu marido, assim como é apropriado no Senhor.",
    "referencia": "Colossenses 3:18",
    "temas": [
      17
    ]
  },
  {
    "id": "atos-8-30-31",
    "trecho": "O senhor entende o que está lendo?",
    "referencia": "Atos 8:30, 31",
    "temas": [
      2
    ]
  },
  {
    "id": "atos-24-15",
    "trecho": "Haverá uma ressurreição tanto de justos como de injustos.",
    "referencia": "Atos 24:15",
    "temas": [
      12
    ]
  },
  {
    "id": "atos-20-35",
    "trecho": "Há mais felicidade em dar do que em receber.",
    "referencia": "Atos 20:35",
    "temas": [
      15
    ]
  },
  {
    "id": "atos-17-27",
    "trecho": "Deus não está longe de cada um de nós.",
    "referencia": "Atos 17:27",
    "temas": [
      18
    ]
  },
  {
    "id": "apocalipse-21-4",
    "trecho": "Ele enxugará dos seus olhos toda lágrima, e não haverá mais morte, nem haverá mais tristeza, nem choro, nem dor.",
    "referencia": "Apocalipse 21:4",
    "temas": [
      10
    ]
  },
  {
    "id": "apocalipse-20-2",
    "trecho": "Ele pegou o dragão, a serpente original, que é o Diabo e Satanás, e o prendeu por mil anos.",
    "referencia": "Apocalipse 20:2",
    "temas": [
      5
    ]
  },
  {
    "id": "apocalipse-20-12-13",
    "trecho": "Os mortos foram julgados pelas coisas escritas nos rolos, segundo as suas ações.",
    "referencia": "Apocalipse 20:12, 13",
    "temas": [
      12
    ]
  },
  {
    "id": "apocalipse-12-9",
    "trecho": "Os seus anjos foram lançados para baixo junto com ele.",
    "referencia": "Apocalipse 12:9",
    "temas": [
      5
    ]
  },
  {
    "id": "daniel-7-1",
    "trecho": "Visões passaram pela sua mente enquanto estava deitado na sua cama.",
    "referencia": "Daniel 7:1",
    "temas": [
      3
    ]
  },
  {
    "id": "apocalipse-11-15",
    "trecho": "O reino do mundo se tornou o Reino do nosso Senhor e do seu Cristo.",
    "referencia": "Apocalipse 11:15",
    "temas": [
      5
    ]
  },
  {
    "id": "2-timoteo-3-1-5",
    "trecho": "Amarão os prazeres em vez de a Deus e manterão uma aparência de devoção a Deus.",
    "referencia": "2 Timóteo 3:1-5",
    "temas": [
      7
    ]
  },
  {
    "id": "2-pedro-3-9",
    "trecho": "Jeová não é vagaroso com relação a sua promessa.",
    "referencia": "2 Pedro 3:9",
    "temas": [
      8
    ]
  },
  {
    "id": "2-pedro-1-21",
    "trecho": "Os homens falaram da parte de Deus conforme eram movidos por espírito santo.",
    "referencia": "2 Pedro 1:21",
    "temas": [
      3
    ]
  },
  {
    "id": "1-timoteo-6-8",
    "trecho": "Tendo o que comer e o que vestir, estaremos contentes com isso.",
    "referencia": "1 Timóteo 6:8",
    "temas": [
      15
    ]
  },
  {
    "id": "1-timoteo-4-15",
    "trecho": "Medite nessas coisas; concentre-se totalmente nelas, para que o seu progresso seja claramente visto por todos.",
    "referencia": "1 Timóteo 4:15",
    "temas": [
      2
    ]
  },
  {
    "id": "1-tessalonicenses-2-13",
    "trecho": "Vocês a aceitaram não como a palavra de homens.",
    "referencia": "1 Tessalonicenses 2:13",
    "temas": [
      3
    ]
  },
  {
    "id": "1-pedro-5-7",
    "trecho": "Lance sobre ele toda a sua ansiedade, porque ele cuida de você.",
    "referencia": "1 Pedro 5:7",
    "temas": [
      8
    ]
  },
  {
    "id": "1-joao-5-3",
    "trecho": "O amor de Deus significa o seguinte: que obedeçamos aos seus mandamentos; contudo, os seus mandamentos não são pesados.",
    "referencia": "1 João 5:3",
    "temas": [
      18
    ]
  },
  {
    "id": "1-joao-5-19",
    "trecho": "O mundo inteiro está no poder do Maligno.",
    "referencia": "1 João 5:19",
    "temas": [
      9
    ]
  },
  {
    "id": "1-joao-3-8",
    "trecho": "Com este objetivo o Filho de Deus foi manifestado: para desfazer as obras do Diabo.",
    "referencia": "1 João 3:8",
    "temas": [
      9
    ]
  },
  {
    "id": "2-timoteo-3-16",
    "trecho": "Toda a Escritura é inspirada por Deus e proveitosa para ensinar.",
    "referencia": "2 Timóteo 3:16",
    "temas": [
      3
    ]
  },
  {
    "id": "isaias-53-5",
    "trecho": "Ele foi traspassado pelas nossas transgressões.",
    "referencia": "Isaías 53:5",
    "temas": [
      6
    ]
  },
  {
    "id": "eclesiastes-1-4",
    "trecho": "A terra permanece para sempre.",
    "referencia": "Eclesiastes 1:4",
    "temas": [
      10
    ]
  },
  {
    "id": "eclesiastes-3-13",
    "trecho": "Que todos comam e bebam, e desfrutem dos resultados de todo o seu trabalho árduo. É a dádiva de Deus.",
    "referencia": "Eclesiastes 3:13",
    "temas": [
      13
    ]
  },
  {
    "id": "isaias-42-8",
    "trecho": "Não dou a minha glória a nenhum outro.",
    "referencia": "Isaías 42:8",
    "temas": [
      1
    ]
  },
  {
    "id": "isaias-41-10",
    "trecho": "Vou segurá-lo firmemente com a minha mão direita de justiça.",
    "referencia": "Isaías 41:10",
    "temas": [
      16
    ]
  },
  {
    "id": "isaias-40-26",
    "trecho": "Por causa da sua imensa energia dinâmica e do seu atemorizante poder.",
    "referencia": "Isaías 40:26",
    "temas": [
      1
    ]
  },
  {
    "id": "isaias-40-22",
    "trecho": "Há Alguém que mora acima do círculo da terra.",
    "referencia": "Isaías 40:22",
    "temas": [
      4
    ]
  },
  {
    "id": "isaias-35-5-6",
    "trecho": "Naquele tempo se abrirão os olhos dos cegos e se destaparão os ouvidos dos surdos.",
    "referencia": "Isaías 35:5, 6",
    "temas": [
      10
    ]
  },
  {
    "id": "isaias-25-8",
    "trecho": "Ele acabará com a morte para sempre, e o Soberano Senhor Jeová enxugará as lágrimas de todo rosto.",
    "referencia": "Isaías 25:8",
    "temas": [
      10
    ]
  },
  {
    "id": "hebreus-3-4",
    "trecho": "Naturalmente, toda casa é construída por alguém, mas quem construiu todas as coisas foi Deus.",
    "referencia": "Hebreus 3:4",
    "temas": [
      1
    ]
  },
  {
    "id": "hebreus-10-24-25",
    "trecho": "Pensemos uns nos outros para nos estimular ao amor e às boas obras, não deixando de nos reunir.",
    "referencia": "Hebreus 10:24, 25",
    "temas": [
      2
    ]
  },
  {
    "id": "genesis-3-15",
    "trecho": "Este esmagará a sua cabeça, e você ferirá o calcanhar dele.",
    "referencia": "Gênesis 3:15",
    "temas": [
      5
    ]
  },
  {
    "id": "genesis-22-18",
    "trecho": "Todas as nações da terra obterão para si uma bênção por meio do seu descendente.",
    "referencia": "Gênesis 22:18",
    "temas": [
      5
    ]
  },
  {
    "id": "eclesiastes-1-7",
    "trecho": "Os rios voltam para o lugar de onde saíram, a fim de correr novamente.",
    "referencia": "Eclesiastes 1:7",
    "temas": [
      4
    ]
  },
  {
    "id": "galatas-3-16-29",
    "trecho": "Além disso, se vocês pertencem a Cristo, são realmente a descendência de Abraão.",
    "referencia": "Gálatas 3:16, 29",
    "temas": [
      5
    ]
  },
  {
    "id": "filipenses-1-9",
    "trecho": "Que o seu amor se torne cada vez mais abundante.",
    "referencia": "Filipenses 1:9",
    "temas": [
      18
    ]
  },
  {
    "id": "filipenses-1-10",
    "trecho": "Certifiquem-se de quais são as coisas mais importantes.",
    "referencia": "Filipenses 1:10",
    "temas": [
      16
    ]
  },
  {
    "id": "exodo-24-4",
    "trecho": "Moisés escreveu todas as palavras de Jeová.",
    "referencia": "Êxodo 24:4",
    "temas": [
      3
    ]
  },
  {
    "id": "efesios-6-4",
    "trecho": "Pais, não irritem os seus filhos, mas continuem a criá-los na disciplina e na instrução de Jeová.",
    "referencia": "Efésios 6:4",
    "temas": [
      17
    ]
  },
  {
    "id": "efesios-6-1-3",
    "trecho": "Filhos, sejam obedientes aos seus pais em união com o Senhor, pois isso é justo.",
    "referencia": "Efésios 6:1-3",
    "temas": [
      17
    ]
  },
  {
    "id": "efesios-5-33",
    "trecho": "A esposa deve ter profundo respeito pelo marido.",
    "referencia": "Efésios 5:33",
    "temas": [
      17
    ]
  },
  {
    "id": "efesios-5-28-29-33",
    "trecho": "Cada um de vocês ame a sua esposa como a si mesmo.",
    "referencia": "Efésios 5:28, 29, 33",
    "temas": [
      17
    ]
  },
  {
    "id": "efesios-4-28",
    "trecho": "A fim de ter algo para repartir com alguém em necessidade.",
    "referencia": "Efésios 4:28",
    "temas": [
      13
    ]
  },
  {
    "id": "eclesiastes-9-5-10",
    "trecho": "Os vivos sabem que morrerão, mas os mortos não sabem absolutamente nada.",
    "referencia": "Eclesiastes 9:5, 10",
    "temas": [
      11
    ]
  },
  {
    "id": "eclesiastes-9-11",
    "trecho": "Porque o tempo e o imprevisto sobrevêm a todos eles.",
    "referencia": "Eclesiastes 9:11",
    "temas": [
      9
    ]
  },
  {
    "id": "filipenses-4-6-7",
    "trecho": "Guardará o seu coração e a sua mente por meio de Cristo Jesus.",
    "referencia": "Filipenses 4:6, 7",
    "temas": [
      16
    ]
  },
  {
    "id": "zacarias-11-12-13",
    "trecho": "Eles pagaram o meu salário, 30 peças de prata.",
    "referencia": "Zacarias 11:12, 13",
    "temas": [
      6
    ]
  }
] satisfies readonly TrechoBruto[];

export const TRECHOS_BIBLICOS = prepararTrechos(TRECHOS_BRUTOS);
