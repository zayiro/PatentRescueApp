export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';

  return '';
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};

export const capitalizar = (item: string) => {
  if (!item) return '';
  return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
};

export const limpiarString = (str: string | null | undefined): string => {
  if (!str) return '';

  return str
    .trim()                    // Espacios
    .toLowerCase()             // Minúsculas
    .normalize('NFD')          // Descomponer acentos
    .replace(/[\u0300-\u036f]/g, '')  // Quitar acentos
    .replace(/[^a-z0-9\s]/g, '')     // Solo letras/números/espacios
    .replace(/\s+/g, ' ');     // Espacios múltiples → uno
};