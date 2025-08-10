/**
 * Configuração centralizada para imagens do Google Drive
 * 
 * Para obter o ID de um arquivo no Google Drive:
 * 1. Faça upload da imagem para o Google Drive
 * 2. Clique com botão direito na imagem e selecione "Compartilhar"
 * 3. Configure como "Qualquer pessoa com o link pode visualizar"
 * 4. Copie o link e extraia o ID (parte entre /d/ e /view)
 * 
 * Exemplo de link: https://drive.google.com/file/d/1ABC123DEF456GHI789JKL/view
 * ID extraído: 1ABC123DEF456GHI789JKL
 */

export const GOOGLE_DRIVE_IMAGE_IDS = {
  // Camisas - Social
  camisasocialvinho: "1ZVCyohjQ31Ytm1fnBasL5O3qLFcXoVmJ",
  camisasocialverdemusgo: "1zcI9uyKsClHbgjMJyt69pLKMpiL-4cbZ", 
  camisasocialverdeclaro: "17s89SpAa1ItGiAKcC5K-wj3cZH703qlf", 
  camisasocialterracota: "1eLlJblnS2JeUrWkz5h96sfc69gvZoTXp",  
  camisasocialpreta: "1ygEga86yI_kR3up86R9spCX-ONOL-FIY",    
  
  // Camisas - Outros
  camisasocialmostarda: "1pq_vgtLZY9Qhv1K-0FpLAfFyxHVkSS4W",  
  camisasocialcurtaquadriculadaclara: "1q5DTOT8VwmZWEymKdDbMYb9RSZB-iG9-", 
  camisasocialcurtaquadriculada: "10wxBNYuwqgmBR266rK3c5UvdpJY-qtkM",
  camisasocialazulclaro: "1dHYAo9lG8LXYD96jkBb31_XzgBkiraKf",
  camisasocialazul: "1IZw8aI-d62AaeQ7MnQq4JIL3_ub_ix-s",
  camisagolapadre: "1LdK4jetUTGadmcC3FZliuhrJj5iYORI2",
  blaserpreto: "1HqbXKJ2qhqX7FENsdKbqQ68qk4BrWhEe",
  blasercinza: "11-pvOYjbDsqXCXoM_OIgQJu0Siov9zT6",
  blaserazul: "1BDg5HUJ2TGxcrAQXkL7byok_DJfBcJMQ",      
} as const;

/**
 * Gera URL completa do Google Drive a partir do ID
 */
export function getGoogleDriveUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Verifica se um ID é válido (formato básico)
 */
export function isValidGoogleDriveId(id: string): boolean {
  return /^[a-zA-Z0-9-_]{25,}$/.test(id);
}

/**
 * Extrai ID do Google Drive de uma URL
 */
export function extractGoogleDriveId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
