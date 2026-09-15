'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { carregarMotor, larguraCena, movimentoReduzido } from '@/lib/motion';

/**
 * Uma seção EMERGE da anterior, como um campo de luz subindo do escuro.
 *
 * DE ONDE VEIO. É o gesto do era-residence aos 103s: com a seção escura ainda
 * fixada, um campo claro sobe pela borda de baixo e cresce até tomar a tela —
 * o conteúdo seguinte já dentro dele. Não é corte nem fade: é uma FORMA
 * emergindo de outra.
 *
 * POR QUE AQUI. A cliente pediu que luz e sombra fossem sentidas pela
 * atmosfera, não explicadas — e foi por isso que os capítulos "Sombra ·
 * Presença · Luz" saíram do site. Este é o conceito acontecendo sem ser dito:
 * cada linha do catálogo nasce de dentro da anterior.
 *
 * COMO FUNCIONA. Duas coisas, e nenhuma delas é `pin`:
 *
 * 1. A seção SOBREPÕE a anterior por margem negativa. Sem sobreposição não há
 *    de onde emergir — a forma recortaria o fundo da página, não a seção de
 *    cima.
 *
 * 2. A borda de cima é uma cúpula (`clip-path: ellipse`) que ACHATA conforme a
 *    seção entra. Uma propriedade só, animável e composta na GPU. No fim do
 *    percurso a elipse está tão larga que a borda é reta, e a seção é um
 *    retângulo comum — nada fica recortado depois.
 */
export default function CenaEmergente({
  children,
  /** Quanto a seção invade a anterior. Em telas baixas, menos. */
  sobreposicao = '9vh',
  className = '',
}: {
  children: ReactNode;
  sobreposicao?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || movimentoReduzido()) return;

    let desmontar = () => {};
    let cancelado = false;

    (async () => {
      const { gsap, ScrollTrigger } = await carregarMotor();
      if (cancelado) return;

      const mm = gsap.matchMedia();

      mm.add(`(min-width: ${larguraCena}px)`, () => {
        const alvo = el.firstElementChild as HTMLElement | null;
        if (!alvo) return;

        const tween = gsap.fromTo(
          alvo,
          { clipPath: 'ellipse(88% 100% at 50% 100%)' },
          {
            /* Larga o bastante para a borda ficar reta. Não animamos para
               `inset(0)` porque interpolar entre funções de clip diferentes
               não é suportado — a forma tem que ser a mesma dos dois lados. */
            clipPath: 'ellipse(300% 100% at 50% 100%)',
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'top 35%',
              scrub: 0.6,
            },
          },
        );

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(alvo, { clearProps: 'clipPath' });
        };
      });

      desmontar = () => mm.revert();
    })();

    return () => {
      cancelado = true;
      desmontar();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`cena-emergente ${className}`}
      style={{ marginTop: `-${sobreposicao}` }}
    >
      {children}
    </div>
  );
}
