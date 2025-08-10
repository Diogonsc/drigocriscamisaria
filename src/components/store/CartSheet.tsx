import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GoogleDriveImage } from "@/components/ui/google-drive-image";
import type { CartItem } from "@/types/store";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useMemo } from "react";
import { DressFormIcon } from "@/components/ui/dress-form-icon";
import { STORE_CONFIG } from "@/config/storeConfig";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQty: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  formatPrice: (cents: number) => string;
}

export const CartSheet = ({ open, onOpenChange, items, onUpdateQty, onRemove, formatPrice }: CartSheetProps) => {
  const total = useMemo(() => items.reduce((acc, i) => acc + i.price * i.quantity, 0), [items]);

  const handleCheckout = () => {
    const lines: string[] = [];
    
    // Cabeçalho do pedido
    lines.push("🛍️ *PEDIDO VIA LOJA ONLINE*");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    
    // Lista de produtos
    items.forEach((i, index) => {
      // Usa a URL da imagem diretamente, sem processamento adicional
      const imgUrl = i.image;
      const subtotal = formatPrice(i.price * i.quantity);
      
      // Cabeçalho do produto
      lines.push(`📦 *PRODUTO ${index + 1}*`);
      lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      // Nome do produto
      lines.push(`*Nome:* ${i.name}`);
      
      // Variações (tamanho e cor)
      if (i.size || i.color) {
        const variations = [];
        if (i.size) variations.push(`Tamanho: ${i.size}`);
        if (i.color) variations.push(`Cor: ${i.color}`);
        lines.push(`*Especificações:* ${variations.join(" | ")}`);
      }
      
      // Quantidade e valores
      lines.push(`*Quantidade:* ${i.quantity}x`);
      lines.push(`*Valor unitário:* ${formatPrice(i.price)}`);
      lines.push(`*Subtotal:* ${subtotal}`);
      
      // Link da imagem
      lines.push(`*Imagem:* ${imgUrl}`);
      
      // Separador entre produtos (exceto no último)
      if (index < items.length - 1) {
        lines.push("");
        lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        lines.push("");
      }
    });
    
    // Resumo final
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push(`💰 *VALOR TOTAL: ${formatPrice(total)}*`);
    lines.push("");
    lines.push("📱 *Aguardando confirmação do pedido*");

    const msg = encodeURIComponent(lines.join("%0A"));
    const phone = STORE_CONFIG.whatsapp.replace(/\D/g, "");
    const url = `https://wa.me/${phone}?text=${msg}`;
    window.open(url, "_blank");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Seu carrinho</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex h-[calc(100vh-8rem)] flex-col space-y-4">
          {/* Seção da loja com logo e nome */}
          <div className="flex items-center gap-3 rounded-lg border bg-gradient-to-r from-[#9bae92] via-[#b8c5b0] to-[#d4ddd0] p-4">
            <DressFormIcon className="h-12 w-12 text-white rounded-full border-2 border-[#798972]" />
            <div>
              <h3 className="font-semibold text-white">{STORE_CONFIG.name}</h3>
              <p className="text-sm text-white/90">{STORE_CONFIG.description}</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
            )}
            {items.map((i) => (
              <div key={i.id} className="flex gap-3 rounded-md border p-2">
                <GoogleDriveImage 
                  src={i.image} 
                  alt={i.name} 
                  className="h-16 w-16 rounded" 
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[i.size && `Tam: ${i.size}`, i.color && `Cor: ${i.color}`].filter(Boolean).join(" | ")}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" onClick={() => onUpdateQty(i.id, Math.max(1, i.quantity - 1))}><Minus /></Button>
                      <span className="w-8 text-center text-sm">{i.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => onUpdateQty(i.id, i.quantity + 1)}><Plus /></Button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Unit.: {formatPrice(i.price)}</p>
                      <p className="text-sm font-semibold">{formatPrice(i.price * i.quantity)}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemove(i.id)}><Trash2 /></Button>
              </div>
            ))}
          </div>
          <div className="border-t pt-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-semibold">{formatPrice(total)}</span>
            </div>
            <Button 
              className="w-full bg-[#9bae92] text-white border-[#9bae92] hover:bg-[#8a9d82] hover:border-[#8a9d82]" 
              size="lg" 
              variant="outline" 
              onClick={handleCheckout} 
              disabled={items.length === 0}
            >
              <MessageCircle className="mr-2" /> Finalizar Pedido
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
