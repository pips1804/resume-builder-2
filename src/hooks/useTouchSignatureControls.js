import { useEffect, useState } from "react";
import { prefersTouchSignatureControls } from "@/lib/signaturePlacement";

export function useTouchSignatureControls() {
  const [touch, setTouch] = useState(() => prefersTouchSignatureControls());

  useEffect(() => {
    const update = () => setTouch(prefersTouchSignatureControls());
    const mqls = [
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(max-width: 1024px)"),
    ];
    mqls.forEach((mql) => mql.addEventListener("change", update));
    window.addEventListener("orientationchange", update);
    return () => {
      mqls.forEach((mql) => mql.removeEventListener("change", update));
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return touch;
}
