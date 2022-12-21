export function setCookie(
  name: string,
  value: string,
  expirationInDays: number
): void {
  const expirationDate = new Date();

  expirationDate.setTime(
    expirationDate.getTime() + expirationInDays * 24 * 60 * 60 * 1000
  );

  const expires = `expires=${expirationDate.toUTCString()}`;

  document.cookie = `${name}=${value};${expires};path=/`;
}
