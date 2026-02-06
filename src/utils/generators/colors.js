/**
 * Calcula a cor de texto ideal (preto ou branco) para um dado fundo hexadecimal.
 * @param {string} hexColor - A cor de fundo em formato hexadecimal (ex: '#RRGGBB').
 * @returns {'#FFFFFF' | '#000000'} - A cor do texto.
 */
export function getTextColorForBackground(hexColor) {
  if (!hexColor || hexColor.length < 4) {
    return '#000000' // Retorna preto por padrão se a cor for inválida
  }

  const cleanHex = hexColor.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  // Fórmula de luminância percebida (padrão W3C)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Se a luminância for > 0.5, o fundo é claro, então o texto deve ser escuro.
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
