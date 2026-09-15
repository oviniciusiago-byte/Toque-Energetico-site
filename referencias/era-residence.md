# era-residence.com — o que foi medido, quadro a quadro

Fonte: gravação de tela de 2m39s feita pelo Vinicius em 15/09/2026, em
`~/Downloads/Gravação de Tela 2026-09-15 às 16.56.10.mov`.
**1916×948 px · 51,62 fps · largura útil da página 1899 px** (17 px de barra de
rolagem). Quadro nativo = 19,4 ms.

> Este documento existe porque eu errei a leitura da cúpula **duas vezes**
> antes de medir. Amostrei primeiro a 0,55 s e depois a 0,1 s — nas duas a
> transição inteira cabia entre dois quadros, e eu descrevi o que *parecia*
> ter acontecido. As duas descrições estavam erradas. O que está abaixo veio
> de extrair os 145 quadros nativos e ajustar geometria neles.

---

## 1. A cúpula (103,2 s → 105,4 s)

### O que eu tinha afirmado antes — e está errado

| Afirmei | Realidade medida |
| --- | --- |
| Uma elipse que **achata** conforme entra | Círculo de **curvatura constante** |
| O raio **cresce** | O raio **não muda**: 950,8 ± 1,2 px em 18 medições |
| O fundo continua **rolando** por trás | O fundo fica **absolutamente parado** |
| É uma animação **`scrub` no clip-path** | Não há animação nenhuma — é rolagem normal |

### O que os quadros mostram

**Raio constante.** Derivando raio e centro a partir de duas medidas
independentes por quadro (ápice da cúpula na coluna central, e meia-largura na
linha `y = 945`):

```
t(s)      ápice   meia-largura   raio    centroY
103,239    884       335,0       950,4    1834,4
103,356    686       653,0       952,7    1638,7
103,433    606       728,0       951,2    1557,2
103,549    523       790,0       950,5    1473,5
103,704    476       820,0       951,3    1427,3
103,743    469       824,0       951,2    1420,2
104,208    417       852,0       951,4    1368,4
104,285    407       857,0       951,6    1358,6
104,363    398       861,0       951,1    1349,1
105,370     47       947,5       948,9     995,9
```

O ápice percorre 884 → 47. O centro sobe 1834 → 996. **O raio não se move.**
Um ajuste de círculo por mínimos quadrados sobre ~135 pontos de borda dá
`rms = 0,5 a 1,5 px` — é um círculo, não uma elipse, não uma curva de Bézier.

**E o raio é exatamente metade da largura da viewport:**
`1899 / 2 = 949,5` contra os 950,8 medidos. Em CSS: **`50vw`**.

**O centro horizontal** fica em `cx = 947,9 ± 0,9` em todos os quadros — o
centro da área útil (`1899/2 = 949,5`). Em CSS: **`50%`**.

**O fundo não se move.** Correlação vertical da faixa `y 40..300` (região que a
cúpula nunca alcança nessa janela), contra o primeiro quadro:

```
t=103,356s  deslocamento = +0 px    t=104,227s  deslocamento = +0 px
t=103,646s  deslocamento = +0 px    t=104,518s  deslocamento = +0 px
t=103,937s  deslocamento = +0 px    t=104,712s  deslocamento = +0 px
```

Zero em cada amostra. A seção que sai está **segurada** (`sticky`), não rolando.
Ela também não tem fade nem escala: a média de luminância cai 95,6 → 93,6
(−2 %) e o desvio 24,96 → 23,99 (−3,9 %) ao longo de 1,8 s — variação pequena
demais para ser um efeito, compatível com o próprio vídeo de fundo escurecendo.

**O conteúdo de dentro sobe junto com a cúpula.** Comparando o deslocamento do
bloco de texto ("THE / SPACE / TO") com o do ápice, quadro a quadro:

```
ápice:  424 → 381 → 367 → 359 → 290     (Δ  −43  −14   −8  −69)
texto:  768 → 718 → 701 → 693 → 624     (Δ  −50  −17   −8  −69)
```

Mesma taxa. O texto **não** está fixo na viewport sendo revelado — ele é parte
da seção que entra e sobe com ela. A cúpula é a **borda de cima da própria
seção**, a uma distância fixa do conteúdo.

**O percurso é uma tela.** O ápice entra em `y = 948` (borda de baixo) e
termina em `y = 0`. Exatamente `100vh` de rolagem, 1:1 — sem multiplicador.

**Não há easing.** O perfil de velocidade é rápido → lento → rápido:

```
103,24 → 103,74 s   ápice 884 → 469   (415 px em 0,50 s)
103,74 → 104,87 s   ápice 469 → 355   (114 px em 1,13 s)
104,87 → 105,33 s   ápice 355 →  48   (307 px em 0,46 s)
```

Isso é a pessoa dando **dois arremessos de rolagem** com a inércia do Lenis
entre eles — não uma curva de animação. A relação rolagem→posição é linear.

### Como se constrói — e é mais simples do que qualquer coisa que eu escrevi

```css
/* a seção que SAI: segura no lugar enquanto a de baixo passa por cima */
.segura {
  position: sticky;
  top: 0;
  height: 100vh;
}

/* a seção que ENTRA: rola normal, com a borda de cima em cúpula */
.emerge {
  position: relative;          /* precisa pintar acima do sticky */
  z-index: 1;
  background: <cor opaca>;     /* a cúpula é o fundo dela */
  border-start-start-radius: 50vw 50vw;
  border-start-end-radius:   50vw 50vw;
}
```

Os dois raios de canto somam `100vw` = a largura do elemento, então os dois
quartos de círculo se encontram no centro e formam **uma semicircunferência
perfeita de raio `50vw`**. É a mesma geometria que eu medi.

**Zero JavaScript. Zero ScrollTrigger. Zero `scrub`.** É por isso que é tão
macio: não há nada sendo recalculado por quadro — é o scroll nativo do
navegador movendo um retângulo com canto arredondado.

Detalhes que importam na hora de aplicar:

- **Não usar `overflow: hidden`** na seção que emerge. `border-radius` já
  recorta o fundo, e `overflow` quebraria qualquer `sticky` descendente. Em vez
  disso, dar respiro no topo: a uma distância `p` do ápice a cúpula tem
  `2·√(2rp − p²)` de largura útil — com `r = 950` e `p = 200 px` já são 1166 px.
  Na era, o "THE" aparece a `p ≈ 344 px`, onde cabem 1463 px.
- **`z-index` na seção que emerge é obrigatório.** Elemento `sticky` pinta
  acima de estático; sem `position: relative; z-index: 1` a cúpula fica
  **atrás** e não aparece.
- **`border-radius` com `vw` se auto-escala.** No celular `50vw ≈ 190 px`, e a
  cúpula vira um arco raso numa tela alta. Decidir se mantém proporcional ou se
  aumenta para algo como `75vw` abaixo de 640 px — **pendente, não testado.**
- **`will-change` não é necessário** e provavelmente piora: não há animação.

---

## 2. O que ainda NÃO foi medido nessa gravação

Ficam para o próximo chat, no mesmo método (extrair quadro nativo, medir,
não descrever de olho):

- **Revelação dos cards ao passar o mouse** — `clip-path` em polígono
  diagonal + escala 1,5→1 + `xPercent` 25→0. Eu tinha isso anotado de
  inspeção do código, **não de medição**. Confirmar nos quadros.
- **Paralaxe de velocidade** entre o título da categoria e a grade abaixo.
  Suspeita: razões diferentes de `y` por unidade de scroll. Medir a razão.
- **Trilha lateral fixa** (contador + rótulo vertical): quando troca o número,
  em relação à borda da seção.
- **Preloader SVG** e a alternância "by day / by night".
- **Transição de rota** (Barba): o que fica, o que sai, e em quanto tempo.
- **SplitText**: unidade (char/palavra/linha), passo da cascata e duração —
  medir num título real em vez de assumir.

## 3. Stack da era (de inspeção, não medida)

GSAP + ScrollTrigger + SplitText + CustomEase + Lenis + Barba, sobre Webflow.

Observação importante que a medição da cúpula deixou clara: **eles usam GSAP
onde precisa e CSS puro onde não precisa.** Eu vinha tratando "animação de
nível awwwards" como sinônimo de ScrollTrigger. O momento mais bonito da
página inteira não tem uma linha de JS.
