import { useEffect } from "react";

export const useProctoring = () => {
  useEffect(() => {
    const disable = (e) => e.preventDefault();
    document.addEventListener("copy", disable);
    document.addEventListener("paste", disable);
    document.addEventListener("contextmenu", disable);

    return () => {
      document.removeEventListener("copy", disable);
      document.removeEventListener("paste", disable);
      document.removeEventListener("contextmenu", disable);
    };
  }, []);
};