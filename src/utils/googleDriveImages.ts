/**
 * Utilitários para gerenciar imagens do Google Drive
 */

/**
 * Converte um link de visualização do Google Drive em um link direto de download
 * @param driveUrl - URL do Google Drive (formato de visualização)
 * @returns URL direta para download da imagem
 */
export function getGoogleDriveImageUrl(driveUrl: string): string {
  // Se já é um link direto, retorna como está
  if (driveUrl.includes('drive.google.com/uc?export=view')) {
    return driveUrl;
  }

  // Extrai o ID do arquivo do Google Drive
  const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!fileIdMatch) {
    console.warn('URL do Google Drive inválida:', driveUrl);
    return driveUrl;
  }

  const fileId = fileIdMatch[1];
  
  // Converte para link direto de download
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Converte múltiplos links do Google Drive
 * @param urls - Objeto com URLs do Google Drive
 * @returns Objeto com URLs convertidas
 */
export function convertGoogleDriveUrls<T extends Record<string, string>>(urls: T): T {
  const converted: any = {};
  
  for (const [key, url] of Object.entries(urls)) {
    converted[key] = getGoogleDriveImageUrl(url);
  }
  
  return converted;
}

/**
 * Interface para configuração de imagens do Google Drive
 */
export interface GoogleDriveImageConfig {
  fileId: string;
  alt?: string;
}

/**
 * Cria URL do Google Drive a partir do ID do arquivo
 * @param fileId - ID do arquivo no Google Drive
 * @returns URL direta para download
 */
export function createGoogleDriveUrl(fileId: string): string {
  // Usando o formato de URL que funciona melhor para exibição de imagens
  // Este formato é mais confiável para tags <img> e evita problemas de CORS
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Cria múltiplas URLs alternativas para uma imagem do Google Drive
 * Útil para fallback quando uma URL não funciona
 * @param fileId - ID do arquivo no Google Drive
 * @returns Array de URLs alternativas
 */
export function createGoogleDriveUrlAlternatives(fileId: string): string[] {
  return [
    // Formato principal - mais confiável
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    // Formato alternativo 1 - thumbnail
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
    // Formato alternativo 2 - download direto
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    // Formato alternativo 3 - visualização
    `https://drive.google.com/file/d/${fileId}/view`,
  ];
}

/**
 * Verifica se uma URL do Google Drive está acessível
 * @param url - URL para verificar
 * @returns Promise<boolean> - true se acessível
 */
export async function checkGoogleDriveUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Erro ao verificar URL do Google Drive:', url, error);
    return false;
  }
}
