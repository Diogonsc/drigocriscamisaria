export type Category = "Camisas" | "Blusas" | "Acessórios";

export interface Product {
  id: string;
  name: string;
  price: number; // em centavos para precisão
  image: string; // imagem padrão
  imagesByColor?: Record<string, string>; // mapa Cor -> imagem
  category: Category;
  sizes: string[];
  colors: string[];
}

export interface CartItem {
  id: string; // unique per cart line (product + variation)
  productId: string;
  name: string;
  image: string;
  price: number; // unitário em centavos
  size?: string;
  color?: string;
  quantity: number;
}
