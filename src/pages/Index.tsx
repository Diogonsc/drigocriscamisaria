import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Wallet } from "lucide-react";
import { DressFormIcon } from "@/components/ui/dress-form-icon";
import { products } from "@/data/products";
import type { CartItem } from "@/types/store";
import type { Product, Category } from "@/types/store";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductModal } from "@/components/store/ProductModal";
import { CartSheet } from "@/components/store/CartSheet";
import { Footer } from "@/components/ui/footer";
import { toast } from "@/hooks/use-toast";

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(  
    cents / 100
  );

// Componente de loading com skeletons
const ProductsLoadingSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="overflow-hidden rounded-lg border bg-card">
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          </div>
          <div className="absolute left-2 top-2">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="pt-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="h-5 w-5 rounded-full bg-gray-200 animate-pulse"
              />
            ))}
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-2" />
            </div>
          </div>
          <div className="h-9 bg-gray-200 rounded animate-pulse mt-3" />
        </div>
      </div>
    ))}
  </div>
);

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("Camisas");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [preselectedColor, setPreselectedColor] = useState<string | undefined>(
    undefined
  );
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title =
      "DrigoCris Camisaria — Loja de Roupas, Calçados e Acessórios";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc)
      metaDesc.setAttribute(
        "content",
        "Compre roupas, calçados e acessórios com envio do pedido direto pelo WhatsApp. Layout moderno e 100% mobile."
      );
  }, []);

  // Função para marcar uma imagem como carregada
  const handleImageLoad = (imageSrc: string) => {
    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(imageSrc);
      return newSet;
    });
  };

  // Verifica se todas as imagens da categoria ativa foram carregadas
  const allImagesLoaded = useMemo(() => {
    const activeProducts = products.filter(
      (p) => p.category === activeCategory
    );

    // Se não há produtos, não há imagens para carregar
    if (activeProducts.length === 0) {
      return true;
    }

    // Conta apenas as imagens principais (uma por produto)
    const totalImages = activeProducts.length;

    // Debug: log para verificar os valores
    console.log("Loading debug:", {
      activeCategory,
      totalProducts: activeProducts.length,
      totalImages,
      loadedImagesCount: loadedImages.size,
      loadedImages: Array.from(loadedImages),
    });

    return loadedImages.size >= totalImages;
  }, [activeCategory, loadedImages]);

  // Esconde o loading da página quando todas as imagens estiverem carregadas
  useEffect(() => {
    if (allImagesLoaded && isPageLoading) {
      // Pequeno delay para uma transição mais suave
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [allImagesLoaded, isPageLoading]);

  // Reseta o loading quando muda de categoria
  useEffect(() => {
    setIsPageLoading(true);
    setLoadedImages(new Set());
  }, [activeCategory]);

  // Timeout de segurança para parar o loading após 10 segundos
  useEffect(() => {
    if (isPageLoading) {
      const timeout = setTimeout(() => {
        console.log("Loading timeout - forcing stop");
        setIsPageLoading(false);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [isPageLoading]);

  const filtered = useMemo(
    () => products.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const handleAddToCart = ({
    product,
    size,
    color,
    quantity,
  }: {
    product: Product;
    size?: string;
    color?: string;
    quantity: number;
  }) => {
    const id = `${product.id}-${size || "na"}-${color || "na"}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id,
          productId: product.id,
          name: product.name,
          image:
            color && product.imagesByColor && product.imagesByColor[color]
              ? product.imagesByColor[color]
              : product.image,
          price: product.price,
          size,
          color,
          quantity,
        },
      ];
    });
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} (${
        [size, color].filter(Boolean).join(" / ") || "sem variação"
      })`,
    });
  };

  const updateQty = (id: string, quantity: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-gradient-to-r from-[#9bae92] via-[#b8c5b0] to-[#d4ddd0] backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-[#9bae92]/90 supports-[backdrop-filter]:via-[#b8c5b0]/90 supports-[backdrop-filter]:to-[#d4ddd0]/90">
        <div className="container mx-auto flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <DressFormIcon className="h-10 w-10 text-white rounded-full border-2 border-[#798972]" />
            <a
              href="#"
              className="text-lg font-semibold story-link"
              aria-label="DRIGOCRIS CAMISARIA"
            >
              DRIGOCRIS CAMISARIA
            </a>
          </div>
          <Button
            variant="outline"
            onClick={() => setCartOpen(true)}
            className="bg-white text-black hover:bg-white/90 hover:text-black"
          >
            <Wallet />
            {items.length > 0 && (
              <span className="px-2 py-1 rounded-full bg-secondary text-xs text-black hover:bg-secondary/90 hover:text-black">
                {items.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="sr-only">Camisaria Masculina — DRIGOCRIS CAMISARIA</h1>

        <section>
          <Tabs
            value={activeCategory}
            onValueChange={(v) => setActiveCategory(v as Category)}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="Camisas">Camisas</TabsTrigger>
              <TabsTrigger value="Blusas">Blusas</TabsTrigger>
              <TabsTrigger value="Acessórios">Acessórios</TabsTrigger>
            </TabsList>
            <TabsContent value={activeCategory}>
              {isPageLoading ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-[#b8c5b0] border-t-[#9bae92] rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <DressFormIcon className="h-6 w-6 text-[#9bae92] rounded-full border-2 border-[#798972]" />
                      </div>
                    </div>
                    <p className="mt-4 text-lg font-medium text-muted-foreground">
                      Carregando produtos...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Aguarde enquanto preparamos tudo para você
                    </p>
                  </div>
                  <ProductsLoadingSkeleton />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelect={(prod, pre) => {
                        setModalProduct(prod);
                        setPreselectedColor(pre?.color);
                      }}
                      formatPrice={formatPrice}
                      onImageLoad={handleImageLoad}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />

      <ProductModal
        product={modalProduct}
        open={!!modalProduct}
        onOpenChange={(open) => {
          if (!open) {
            setModalProduct(null);
            setPreselectedColor(undefined);
          }
        }}
        onAddToCart={handleAddToCart}
        formatPrice={formatPrice}
        initialColor={preselectedColor}
      />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={items}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default Index;
