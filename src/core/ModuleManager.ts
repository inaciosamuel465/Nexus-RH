import fs from 'fs';
import path from 'path';
import { Express } from 'express';
import { logger } from './logger.js';

export class ModuleManager {
  private app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  public async loadModules(modulesDir?: string): Promise<void> {
    const dir = modulesDir || path.join(process.cwd(), 'src', 'modules');
    
    if (!fs.existsSync(dir)) {
      logger.warn(`Diretório de módulos ausente em ${dir}. Executando auto-criação...`);
      fs.mkdirSync(dir, { recursive: true });
      return;
    }

    const modules = fs.readdirSync(dir, { withFileTypes: true });
    let loadedCount = 0;

    for (const mod of modules) {
      if (mod.isDirectory()) {
         try {
           const routePath = path.join(dir, mod.name, 'routes.ts');
           const jsRoutePath = path.join(dir, mod.name, 'routes.js');
           
           let targetFile = null;
           if (fs.existsSync(routePath)) targetFile = routePath;
           else if (fs.existsSync(jsRoutePath)) targetFile = jsRoutePath;

           if (targetFile) {
               const moduleUrl = `file://${targetFile.replace(/\\/g, '/')}`;
               const routeModule = await import(moduleUrl);
               
               const router = routeModule.default || routeModule.router;
               if (router) {
                   const prefix = `/api/v2/modules/${mod.name}`;
                   this.app.use(prefix, router);
                   logger.info(`Modulo App acoplado: [${mod.name}] -> Rota base: ${prefix}`);
                   loadedCount++;
               }
           }
         } catch(e) {
             logger.error(`Rotina faliu ao importar module ${mod.name}:`, e);
         }
      }
    }
    
    logger.info(`ModuleManager completou injeção de rotas com ${loadedCount} domínios acoplados.`);
  }
}
