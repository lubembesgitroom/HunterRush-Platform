"use client";

import {
  useEffect,
  useRef,
} from "react";

type GroundProps = {
  speed: number;
};

export default function Ground({
  speed,
}: GroundProps) {
  const offset =
    useRef(0);

  const groundRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    let frame = 0;

    const animate = () => {
      offset.current +=
        speed * 0.12;

      if (
        offset.current >= 64
      ) {
        offset.current = 0;
      }

      if (
        groundRef.current
      ) {
        groundRef.current.style.backgroundPositionX =
          `-${offset.current}px`;
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
      <div
        style={{
          position:
            "absolute",

          left: 0,

          right: 0,

          bottom: 72,

          height: 2,

          background:
            "#6df08d",

          opacity: 0.55,

          zIndex: 2,
        }}
      />

      <div
        ref={groundRef}
        style={{
          position:
            "absolute",

          left: 0,

          right: 0,

          bottom: 0,

          height: 72,

          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              #2d2d2d 0px,
              #2d2d2d 32px,
              #373737 32px,
              #373737 64px
            )
          `,

          borderTop:
            "2px solid #6df08d",

          overflow: "hidden",

          zIndex: 1,
        }}
      />

      <div
        style={{
          position:
            "absolute",

          left: 0,

          right: 0,

          bottom: 60,

          height: 8,

          background:
            "rgba(255,255,255,.04)",

          filter:
            "blur(4px)",

          zIndex: 0,
        }}
      />
    </>
  );
}