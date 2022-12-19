

export function setCookie(name: string, value: string, expirationInDays: number): void {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (expirationInDays * 24 * 60 * 60 * 1000));
  const expires = `expires=${expirationDate.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for(let c of ca) {
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string): void {
  setCookie(name, "", -1);
}