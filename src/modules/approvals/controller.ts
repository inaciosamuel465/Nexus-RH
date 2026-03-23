import { Response } from 'express';
import { AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';
import { logger } from '../../core/logger.js';

export const createRequest = async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'DB error out' });
  const { type, details } = req.body;
  const userId = req.user?.userId;

  try {
    // 1. Acha ativamente qual o líder superior deste usuário no banco unificado Neon
    const userRes = await dbPool.query('SELECT manager_id FROM users WHERE id = $1', [userId]);
    const managerId = userRes.rows[0]?.manager_id;

    if (!managerId) {
      return res.status(400).json({ error: 'Este operador de acesso não possui nenhum Líder associado hierarquicamente em sua conta. A operação não pôde ser repassada.' });
    }

    // 2. Encaminha e salva pedido relacionando a ID do gestor direto dele
    const insertQuery = `
      INSERT INTO approval_requests (requester_id, lider_id, type, details)
      VALUES ($1, $2, $3, $4) RETURNING id;
    `;
    const result = await dbPool.query(insertQuery, [userId, managerId, type, JSON.stringify(details)]);
    
    logger.info(`Solicitação (${type}) aberta pelo user ${userId} e enviada ao leader ${managerId}`);
    res.json({ success: true, message: 'Solicitação arquivada. Aguardando a aprovação do seu Gestor.', trackingId: result.rows[0].id });
  } catch(err: any) {
    logger.error('Erro na criação de solicitação do colaborador:', err);
    res.status(500).json({ error: 'Falha durante operação' });
  }
};

export const listPendingForLider = async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'DB em pane no Neon.' });
  const liderId = req.user?.userId;
  
  try {
    // Filtramos globalmente onde Lider Sou Eu E os status não foram abatidos por workflow da IA.
    const result = await dbPool.query(`
      SELECT r.id, r.type, r.details, r.created_at, u.name as requester_name 
      FROM approval_requests r
      JOIN users u ON r.requester_id = u.id
      WHERE r.lider_id = $1 AND r.status = 'PENDING'
    `, [liderId]);
    
    res.json({ success: true, inboxPendenteCount: result.rows.length, requestsOverviewInbox: result.rows });
  } catch(err: any){
    logger.error('Erro tentando listar caixa de pendencias da liderança:', err);
    res.status(500).json({ error: 'Leitura falhou.' });
  }
}

export const approveRequest = async (req: AuthRequest, res: Response) => {
    if (!dbPool) return res.status(500).json({ error: 'Banco Down' });
    const { requestId } = req.params;
    const liderId = req.user?.userId;
    const { decision } = req.body; // Aceita strings 'APPROVED' ou 'REJECTED'

    try {
      // Retentor Seguro. Só altera a linha SE o Lider ID do Header do Token match com a atribuição Original.
      const result = await dbPool.query(`
        UPDATE approval_requests 
        SET status = $1 
        WHERE id = $2 AND lider_id = $3
        RETURNING id, status
      `, [decision, requestId, liderId]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Solicitação inacessível. Isso ocorre quando o requerimento não existe ou você não possui vínculo de líder direto com quem enviou o processo.' });
      }

      logger.info(`Workflow Operacional: Lider ${liderId} procedeu com ato (${decision}) na permissão (${requestId})`);
      res.json({ success: true, message: `Despacho finalizado confirmando: ${decision}` });
    } catch(err: any){
      logger.error('Validação Neon no módulo de liderança falhou.', err);
      res.status(500).json({ error: 'Modificação falhou' });
    }
}
