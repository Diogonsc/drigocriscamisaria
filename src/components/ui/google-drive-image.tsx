import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getGoogleDriveImageUrl, createGoogleDriveUrlAlternatives } from "@/utils/googleDriveImages";

interface GoogleDriveImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
}

export const GoogleDriveImage: React.FC<GoogleDriveImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  loading = "lazy",
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [urlIndex, setUrlIndex] = useState(0);

  useEffect(() => {
    if (!src) return;

    // Converte URL do Google Drive se necessário
    const convertedSrc = getGoogleDriveImageUrl(src);
    setImageSrc(convertedSrc);
    setIsLoading(true);
    setHasError(false);
    setUrlIndex(0);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    // Extrai o ID do arquivo para tentar URLs alternativas
    const fileIdMatch = src.match(/\/d\/([a-zA-Z0-9-_]+)/) || src.match(/id=([a-zA-Z0-9-_]+)/);
    
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      const alternatives = createGoogleDriveUrlAlternatives(fileId);
      
      if (urlIndex < alternatives.length - 1) {
        const nextUrlIndex = urlIndex + 1;
        const nextUrl = alternatives[nextUrlIndex];
        
        setUrlIndex(nextUrlIndex);
        setImageSrc(nextUrl);
        setIsLoading(true);
        setHasError(false);
        return;
      }
    }
    
    // Se não há mais alternativas, tenta fallback
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setIsLoading(true);
      setHasError(false);
    } else {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }
  };

  if (!imageSrc) {
    return (
      <div className={cn("bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse", className)}>
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse z-10">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#9bae92] rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-20">
          <div className="text-center text-muted-foreground p-4">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium">Imagem não disponível</p>
            <p className="text-xs text-gray-400 mt-1">Verifique as permissões do Google Drive</p>
          </div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
        style={{ objectPosition: 'top' }}
      />
    </div>
  );
};
