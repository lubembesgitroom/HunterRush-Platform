"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  DustTrailProps,
} from "./hunter.types";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  life: number;
  vx: number;
  vy: number;
}

export default function DustTrail({
  intensity,
}: DustTrailProps) {
  const idRef = useRef(0);

  const frameRef =
    useRef<number | null>(null);

  const [particles, setParticles] =
    useState<Particle[]>([]);

  const spawnRate = useMemo(() => {
    return Math.max(
      0,
      Math.floor(
        intensity * 5,
      ),
    );
  }, [intensity]);

  useEffect(() => {
    const animate = () => {
      setParticles((current) => {
        const next = current
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.025,
          }))
          .filter((particle) => particle.life > 0);

        for (let i = 0; i < spawnRate; i++) {
          next.push({
            id:
              idRef.current++,

            x: 0,

            y: Math.random() * 16,

            size: 6 + Math.random() * 10,

            life: 1,

            vx: -2 - Math.random() * 4,

            vy: -0.5 + Math.random(),
          });
        }

        return next;
      });

      frameRef.current =
        requestAnimationFrame(
          animate,
        );
    };

    animate();

    return () => {
      if (
        frameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          frameRef.current,
        );
      }
    };
  }, [spawnRate]);

  return (
    <div
      style={{
        position:
          "absolute",

        left: "18%",

        bottom: 78,

        width: 140,

        height: 60,

        overflow: "visible",

        pointerEvents:
          "none",

        zIndex: 15,
      }}
    >
      {particles.map(
        (particle) => (
          <div
            key={
              particle.id
            }
            style={{
              position:
                "absolute",

              left:
                particle.x,

              top:
                particle.y,

              width:
                particle.size,

              height:
                particle.size,

              borderRadius:
                "50%",

              background:
                "rgba(220,220,220,.65)",

              opacity:
                particle.life,

              transform: `
                scale(${particle.life})
              `,

              filter:
                "blur(2px)",

              willChange:
                "transform, opacity",
            }}
          />
        ),
      )}
    </div>
  );
}