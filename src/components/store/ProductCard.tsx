import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoogleDriveImage } from "@/components/ui/google-drive-image";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/store";
import { useMemo, useState } from "react";
import { colorToCss } from "@/utils/colorMap";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product, preselected?: { color?: string }) => void;
  className?: string;
  formatPrice: (cents: number) => string;
  onImageLoad?: (imageSrc: string) => void;
}

export const ProductCard = ({ product, onSelect, className, formatPrice, onImageLoad }: ProductCardProps) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const displayImage = useMemo(() => {
    if (selectedColor && product.imagesByColor && product.imagesByColor[selectedColor]) {
      return product.imagesByColor[selectedColor];
    }
    return product.image;
  }, [product, selectedColor]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    // Sempre reporta a imagem principal do produto, não a imagem da cor selecionada
    onImageLoad?.(product.image);
  };

  // Reset image loaded state when color changes
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setIsImageLoaded(false);
  };

  return (
    <Card className={cn("overflow-hidden group hover-scale", className)}>
      <div className="relative overflow-hidden rounded-t-lg h-96">
        <GoogleDriveImage
          src={displayImage}
          alt={`Foto do produto ${product.name}`}
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
          onLoad={handleImageLoad}
        />
        <div className="absolute left-2 top-2">
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </div>
      <CardContent className="pt-4">
        {product.colors.length > 1 && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                aria-label={`Cor ${c}`}
                onClick={() => handleColorChange(c)}
                className={cn("h-5 w-5 rounded-full border", selectedColor === c && "ring-2 ring-ring ring-offset-2")}
                style={{ backgroundColor: colorToCss(c) }}
              />
            ))}
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-medium line-clamp-2">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{formatPrice(product.price)}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="mt-3 w-full bg-[#9bae92] text-white border-[#9bae92] hover:bg-[#8a9d82] hover:border-[#8a9d82]" 
          onClick={() => onSelect(product, { color: selectedColor })}
        >
          Ver opções
        </Button>
      </CardContent>
    </Card>
  );
};
