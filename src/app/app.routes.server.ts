import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamic route — product IDs are not known at build time, render client-side
  {
    path: 'products/:id',
    renderMode: RenderMode.Client,
  },
  // All other routes — pre-rendered at build time for static hosting (Hostinger)
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
