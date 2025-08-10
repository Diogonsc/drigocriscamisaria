export const colorToCss = (name: string): string => {
  const map: Record<string, string> = {
    Branco: "hsl(0 0% 98%)",
    Preto: "hsl(0 0% 10%)",
    Azul: "hsl(220 90% 56%)",
    "Azul Jeans": "hsl(217 44% 42%)",
    Verde: "hsl(120 15% 60%)",
    Lavanda: "hsl(260 58% 76%)",
    Caramelo: "hsl(28 60% 47%)",
    Prata: "hsl(0 0% 70%)",
    "Preta": "hsl(0 0% 10%)",
  };
  return map[name] || "hsl(0 0% 70%)";
};
