# Primeiro comando do próximo chat

> Copie tudo abaixo da linha e cole como primeira mensagem.

---

Você vai continuar o site da **Toque Energético**. Leia estes três arquivos
antes de qualquer coisa — eles são a fonte de verdade e me poupam de repetir
tudo:

- `handoff-2026-09-15.md` — contexto completo, acessos, decisões, erros
- `referencias/era-residence.md` — a medição quadro a quadro da referência
- `docs/direcao-cliente-2026-09-15.md` — a régua de voz que a cliente mandou

**Projeto:** `/Users/viniciuspereira/Library/CloudStorage/GoogleDrive-oviniciusiago@gmail.com/Meu Drive/TOQUE ENERGÉTICO BASE SITE`
**No ar:** https://toque-energetico.vercel.app · **Publicar:** `npm run deploy`
(push **não** publica) · **Entrega: 21/09/2026.**

---

## O que eu quero

Site-catálogo (não é loja — fecha no WhatsApp) da Toque Energético, marca de
autocuidado artesanal da Maria Fernanda Pavan. A referência que eu quero
alcançar é **https://www.era-residence.com/** — eu gravei a tela dela por
2m39s e o vídeo está em
`~/Downloads/Gravação de Tela 2026-09-15 às 16.56.10.mov`.

Eu disse duas coisas no chat anterior e as duas continuam valendo:

**1.** *"O catálogo está muito aquém do que você é capaz. Fraco de design,
fraco de animação, as imagens não estão boas o suficiente."*

**2.** *"Você não mudou nada na home do site, continua tudo com o mesmo layout
ruim. E aparentemente também não entendeu como funciona aquela cúpula do site
da era."*

**Achei as animações da era muito bem construídas e você ainda não chegou perto
delas. Quero explorar essa referência a fundo neste chat.**

---

## Ordem de trabalho

### 1 · Estudar a era de verdade — medindo, não olhando

No chat anterior eu errei o mecanismo da cúpula **duas vezes** porque descrevi
o que parecia acontecer em vez de medir. Só acertei extraindo os 145 quadros
nativos (51,62 fps) e ajustando geometria neles. O resultado está em
`referencias/era-residence.md`: a cúpula é **círculo de raio constante `50vw`**
sobre um fundo **parado**, e **não tem uma linha de JavaScript** — é
`position: sticky` + `border-radius: 50vw 50vw 0 0`.

Faça o mesmo com o resto. As ferramentas já estão no lugar:
`ffmpeg`/`ffprobe` em `<scratchpad>/node_modules/ffmpeg-static/`, PIL 11.3 no
`python3` do sistema.

Mecanismos ainda **não medidos**, listados na seção 2 daquele arquivo:

- revelação do card no hover (clip-path diagonal + escala + `xPercent`)
- paralaxe de velocidade entre título da categoria e a grade
- trilha lateral fixa: quando o contador troca em relação à borda da seção
- SplitText: unidade, passo da cascata, duração — medir num título real
- transição de rota (Barba): o que fica, o que sai, em quanto tempo
- preloader SVG e a alternância "by day / by night"

**Atualize `referencias/era-residence.md` com cada medição nova.** Quero esse
arquivo virando o manual da referência.

### 2 · Consertar a cúpula

`components/scroll/CenaEmergente.tsx` está com o mecanismo errado (elipse que
achata + `scrub` do GSAP sobre fundo rolando). Reescreva com o que foi medido.
Deve sobrar CSS e sumir o GSAP de dentro dele.

### 3 · Redesenhar a home — este é o pedido central

`app/page.tsx` continua com a espinha de sempre: seção, título, grade, seção,
título, grade, tudo com `Reveal` por cima. As cenas novas foram **encaixadas
dentro** do layout velho em vez de o layout ter sido repensado. É isso que eu
chamei de "mesmo layout ruim".

Não quero mais uma seção nova. Quero a página **recomposta**, no ritmo da era:
imagem forte + frase curta, muito respiro, atmosfera no lugar de explicação,
cada troca de seção sendo um gesto e não um corte.

A régua da cliente vale aqui: *"Não é sobre apagar o que você sente. É sobre
permanecer em si enquanto sente."* Luz e sombra são **sentidas**, nunca
legendadas. Silêncio visual e espaço são parte da marca.

**Me apresente a nova espinha da home antes de escrever o código** — em texto,
seção por seção, dizendo o que cada momento faz e por quê. Só isso eu quero
aprovar antes. O resto executa.

### 4 · Catálogo ao mesmo nível

Depois da home: hover dos cards, paralaxe entre título e grade, marginália
fixa — tudo com base no que você mediu no passo 1.

### 5 · Copy e imagens (pode ir em paralelo)

- Terminar a varredura pela régua da cliente: falta o **Spray de Proteção**
  (reposicionar para *"estar no mundo sem absorver tudo"*), velas, brumas,
  incensos, óleos, roll-ons, presentes, `content/categorias.ts`, e as páginas
  `/sobre`, `/rituais`, `/atacado`.
- Imagens que faltam: 5 linhas do catálogo, 7 capas de categoria,
  15 editoriais. Use o **Magnific MCP** com `imagen-nano-banana-2` (é o Nano
  Banana Pro), produtos em **4:5**, cenas em **16:9**, a partir das fotos reais
  em `…/Meu Drive/TOQUE ENERGÉTICO/IMAGENS/BANHO/`.
- **Uma geração por prompt.** Crédito é caro.
- O nome do "Encantamento" ficou obscurecido em 3 tentativas — resolva com
  `images_retouch` cirúrgico, não gerando a imagem inteira de novo.

---

## Como trabalhar comigo

- **Executa.** Se eu já pedi, não me pergunte se pode fazer. Pergunta só o que
  muda o resultado de verdade — e a única coisa nessa lista é a espinha da home.
- **Mede antes de afirmar.** Se for descrever movimento de vídeo, extraia
  quadro nativo. Descrição de olho já me custou duas rodadas.
- **Use o Claude in Chrome**, não o painel de navegador embutido. O embutido,
  escondido, congela o `gsap.ticker` e faz parecer que a animação quebrou.
- **Nada de `opacity-*` para hierarquia de texto** — o contraste é calculado em
  `lib/contraste.ts` e opacidade desfaz a garantia.
- **Nada de `pin` do ScrollTrigger** — usa `position: sticky`. O `pin` já
  quebrou a página inteira brigando com o React na troca de rota.
- `npm run typecheck` antes de commitar. Nunca `next build` com o `dev` no ar.
- Mensagem de commit em português, dizendo o que mudou para o usuário do site,
  não o nome do arquivo.
- Se tiver defeito conhecido no que você entregou, **me conte**. Não esconda.

Comece lendo os três arquivos e me diga o plano da home.
