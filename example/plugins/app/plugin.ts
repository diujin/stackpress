//stackpress
import type { Server } from 'stackpress/server';
//local
import { config } from '../config';

export default function plugin(server: Server) {
  server.config.set(config);
  server.on('listen', async _ => {
    //on error, show error page
    server.on('error', () => import('./pages/error'));
    server.on('error', '@/plugins/app/templates/error', -100);
    //static assets
    server.on('request', async (req, res) => {  
      if (!res.body && (!res.code || res.code === 404)) {
        const page = await import('./pages/public');
        await page.default(req, res, server);
      }
    });
    //on response, check for errors
    server.on('response', async (req, res, ctx) => {  
      if (res.error) {
        await ctx.emit('error', req, res);
      }
    });
  });
  server.on('route', async _ => {
    server.all('/', '@/plugins/app/templates/home', -100);
  });
};