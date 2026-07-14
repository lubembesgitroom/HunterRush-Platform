"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  BackgroundScrollerProps,
} from "./hunter.types";

export default function BackgroundScroller({
  speed,
}: BackgroundScrollerProps) {
  const skyRef =
    useRef<HTMLDivElement | null>(null);

  const mountainRef =
    useRef<HTMLDivElement | null>(null);

  const treesRef =
    useRef<HTMLDivElement | null>(null);

  const skyOffset =
    useRef(0);

  const mountainOffset =
    useRef(0);

  const treeOffset =
    useRef(0);

  useEffect(() => {
    let frame = 0;

    const animate = () => {
      skyOffset.current +=
        speed * 0.01;

      mountainOffset.current +=
        speed * 0.04;

      treeOffset.current +=
        speed * 0.10;

      if (skyRef.current) {
        skyRef.current.style.backgroundPositionX =
          `-${skyOffset.current}px`;
      }

      if (mountainRef.current) {
        mountainRef.current.style.backgroundPositionX =
          `-${mountainOffset.current}px`;
      }

      if (treesRef.current) {
        treesRef.current.style.backgroundPositionX =
          `-${treeOffset.current}px`;
      }

      frame =
        requestAnimationFrame(
          animate,
        );
    };

    animate();

    return () =>
      cancelAnimationFrame(
        frame,
      );
  }, [speed]);

  return (
    <>
      {/* Sky */}

      <div
        ref={skyRef}
        style={{
          position: "absolute",

          inset: 0,

          background: `
            linear-gradient(
              to bottom,
              #081223 0%,
              #122949 45%,
              #1d4f7c 100%
            )
          `,

          backgroundSize:
            "1200px 100%",

          zIndex: -30,
        }}
      />

      {/* Stars */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          opacity: 0.22,

          backgroundImage: `
            radial-gradient(
              white 1px,
              transparent 1px
            )
          `,

          backgroundSize:
            "120px 120px",

          zIndex: -29,
        }}
      />

      {/* Mountains */}

      <div
        ref={mountainRef}
        style={{
          position: "absolute",

          left: 0,

          right: 0,

          bottom: 72,

          height: 180,

          backgroundImage: `
            repeating-linear-gradient(
              135deg,
              transparent 0px,
              transparent 90px,
              #22354f 90px,
              #22354f 180px
            )
          `,

          clipPath:
            "polygon(0% 100%,8% 55%,18% 88%,30% 40%,45% 90%,60% 48%,74% 86%,86% 36%,100% 100%)",

          opacity: 0.7,

          backgroundSize:
            "1200px 180px",

          zIndex: -15,
        }}
      />

      {/* Tree line */}

      <div
        ref={treesRef}
        style={{
          position: "absolute",

          left: 0,

          right: 0,

          bottom: 72,

          height: 110,

          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              #0d2618 0px,
              #0d2618 16px,
              transparent 16px,
              transparent 34px
            )
          `,

          opacity: 0.9,

          backgroundSize:
            "600px 100px",

          zIndex: -8,
        }}
      />
    </>
  );
}