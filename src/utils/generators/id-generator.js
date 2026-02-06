/**
 * Gera um ID único para componentes de UI, usando um prefixo para legibilidade.
 * @param {string} prefix - Um prefixo para o ID (ex: 'input-email').
 * @returns {string} Um ID único.
 */
export function generateUniqueId(prefix = 'uid') {
  // Limpa o prefixo para que ele possa ser usado em um atributo id.
  const sanitizedPrefix = prefix.toString().toLowerCase().replace(/\s+/g, '-')

  // Gera uma string aleatória curta.
  const randomPart = Math.random().toString(36).substring(2, 9)

  return `${sanitizedPrefix}-${randomPart}`
}
