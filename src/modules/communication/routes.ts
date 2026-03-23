import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';
import { io } from '../../../server.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../../core/logger.js';

export const router = Router();
router.use(authMiddleware);

router.post('/generate-post', async (req: AuthRequest, res: Response) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key do Gemini não configurada.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const aiPrompt = `Atue como um Especialista em Comunicação Interna e Cultura Organizacional (Endomarketing).
Você usará o tema a seguir para criar um post engajador para o feed corporativo.
TEMA/INSTRUÇÃO: "${prompt}"

Siga estas regras:
1. O título ("title") deve ser curto, magnético e chamar atenção.
2. O conteúdo ("content") deve ter um tom adequado (formal mas acolhedor, dependendo do assunto) e não exceder 4 parágrafos.
3. Não inclua assinaturas no post.
4. Escolha uma única keyword em inglês ("imageKeyword") de 1 palavra que melhor represente visualmente a postagem (ex: "technology", "celebration", "meeting", "diversity") para buscarmos uma imagem ilustrativa.

Retorne OBRIGATORIAMENTE um JSON (e apenas um JSON válido, sem tags markdown) no formato:
{
  "title": "O Título",
  "content": "O corpo do texto com quebras de linha (\\n\\n)",
  "imageKeyword": "palavra-chave",
  "type": "comunicado" // pode ser comunicado, evento, reconhecimento, aviso ou treinamento
}`;

    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();
    
    try {
      const parsed = JSON.parse(text);
      res.json({
         success: true,
         data: {
           title: parsed.title,
           content: parsed.content,
           type: parsed.type,
           imageUrl: `https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200&query=${encodeURIComponent(parsed.imageKeyword)}`
         }
      });
    } catch(err) {
      logger.error('Erro no parse do JSON do Gemini:', text);
      res.status(500).json({ error: 'Erro ao interpretar resposta do Gemini' });
    }
  } catch (err: any) {
    logger.error('Erro na AI Gen:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/posts', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT * FROM communication_posts WHERE tenant_id = $1 ORDER BY created_at DESC', [req.user?.tenantId]);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/notice', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { type, title, content, targetDepartments, targetRoles } = req.body;
    const result = await dbPool.query(
      `INSERT INTO communication_posts (tenant_id, author_id, type, title, content, target_departments, target_roles)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user?.tenantId, req.user?.userId, type, title, content, targetDepartments || [], targetRoles || []]
    );

    const post = result.rows[0];
    if (io) {
      io.to(req.user?.tenantId).emit('new_notice', post);
    }

    res.json({ success: true, data: post });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
