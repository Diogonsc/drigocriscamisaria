import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { GoogleDriveImage } from "@/components/ui/google-drive-image";
import type { Product } from "@/types/store";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { colorToCss } from "@/utils/colorMap";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductModalProps {
  product?: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (payload: { product: Product; size?: string; color?: string; quantity: number }) => void;
  formatPrice: (cents: number) => string;
  initialColor?: string;
}

export const ProductModal = ({ product, open, onOpenChange, onAddToCart, formatPrice, initialColor }: ProductModalProps) => {
  const [size, setSize] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open && product) {
      setColor(initialColor ?? product.colors?.[0]);
    }
  }, [product, open, initialColor]);

  const displayImage = useMemo(() => {
    if (product && color && product.imagesByColor && product.imagesByColor[color]) {
      return product.imagesByColor[color];
    }
    return product?.image ?? "";
  }, [product, color]);

  const disabled = !product;

  const reset = () => {
    setSize(undefined);
    setColor(undefined);
    setQuantity(1);
  };

  const handleAdd = () => {
    if (!product) return;
    onAddToCart({ product, size, color, quantity });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="h-full w-full max-h-none max-w-none rounded-none p-0 sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-lg sm:p-6">
        {/* Header fixo para mobile */}
        <DialogHeader className="sticky top-0 z-20 flex flex-row items-center justify-between bg-background px-4 py-3 shadow-sm sm:relative sm:shadow-none sm:px-0 sm:py-0">
          <DialogTitle className="text-lg font-semibold">Selecionar opções</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </button>
        </DialogHeader>

        {product && (
          <div className="flex h-full flex-col overflow-hidden sm:block">
            {/* Conteúdo com scroll */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-0 sm:pb-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Imagem */}
                <div className="sm:order-1">
                  <div className="overflow-hidden rounded-md border">
                    <GoogleDriveImage
                      src={displayImage}
                      alt={`Foto do produto ${product.name}${color ? ` - cor ${color}` : ""}`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  {product.colors.length > 1 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Cores disponíveis:</span>
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          aria-label={`Cor ${c}`}
                          onClick={() => setColor(c)}
                          className={cn(
                            "h-8 w-8 rounded-full border-2 transition-all",
                            color === c 
                              ? "ring-2 ring-ring ring-offset-2 scale-110" 
                              : "hover:scale-105"
                          )}
                          style={{ backgroundColor: colorToCss(c) }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Informações e opções */}
                <div className="space-y-6 sm:order-2">
                  <div>
                    <h3 className="text-xl font-semibold sm:text-2xl">{product.name}</h3>
                    <p className="mt-2 text-lg font-medium text-primary">{formatPrice(product.price)}</p>
                  </div>
                  
                  <div className="space-y-4">
                    {product.sizes.length > 0 && (
                      <div>
                        <label className="mb-2 block text-sm font-medium">Tamanho</label>
                        <Select onValueChange={setSize} value={size}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tamanho" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.sizes.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {product.colors.length > 0 && (
                      <div>
                        <label className="mb-2 block text-sm font-medium">Cor</label>
                        <Select onValueChange={setColor} value={color}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cor" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.colors.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div>
                      <label className="mb-2 block text-sm font-medium">Quantidade</label>
                      <div className="flex items-center gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="h-10 w-10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input 
                          type="number" 
                          min={1} 
                          value={quantity} 
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || '1', 10)))} 
                          className="w-20 text-center h-10" 
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setQuantity((q) => q + 1)}
                          className="h-10 w-10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão fixo na parte inferior para mobile */}
            <div className="sticky bottom-0 z-20 border-t bg-background px-4 py-4 shadow-lg sm:hidden">
              <Button disabled={disabled} onClick={handleAdd} variant="cta" className="w-full h-12 text-base">
                Adicionar ao carrinho
              </Button>
            </div>

            {/* Botão para desktop */}
            <div className="hidden sm:block sm:pt-6">
              <Button disabled={disabled} onClick={handleAdd} variant="cta" className="w-full h-12 text-base">
                Adicionar ao carrinho
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
