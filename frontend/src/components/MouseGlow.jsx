import { useEffect, useState } from "react";

function MouseGlow() {

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {

    function handleMouseMove(e) {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };

  }, []);

  return (
    <div
      className="pointer-events-none fixed w-96 h-96 rounded-full blur-3xl bg-cyan-500/20 transition-transform duration-100"
      style={{
        left: position.x - 190,
        top: position.y - 190,
      }}
    />
  );
}

export default MouseGlow;