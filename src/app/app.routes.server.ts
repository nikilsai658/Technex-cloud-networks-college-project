import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Logged-in pages need the auth token, which only exists in the browser.
  // Rendering them on the server calls the API without a token (401s).
  {
    path: 'main/**',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
