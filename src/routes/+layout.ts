/**
 * Root Layout Config
 * 
 * Configures SPA mode: prerenders all pages, disables SSR, enforces trailing slashes.
 */

export const prerender = true;
export const trailingSlash = 'always';
export const ssr = false;