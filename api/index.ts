/**
 * Vercel Serverless Function entrypoint.
 *
 * O Vercel espera um export default de um handler compatível com Node.js
 * (req, res). Aqui reutilizamos o app Express existente sem alterá-lo.
 */
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

// Inicializa as rotas de forma síncrona no cold start da função
const server = await (async () => {
  const { createServer } = await import("http");
  const httpServer = createServer(app);

  const { seedDatabase } = await import("../server/seed");
  await seedDatabase().catch((e) => console.error("Seed error:", e));

  await registerRoutes(httpServer, app);

  // Handler de erros global
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  return app;
})();

export default app;
