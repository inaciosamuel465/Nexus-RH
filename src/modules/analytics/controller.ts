import { Response } from 'express';
import { AuthRequest } from '../../core/authMiddleware.js';
import { EmployeeModel } from '../../models/Employee.js';
import { skillService } from '../../services/SkillService.js';

export const getDashboardKPIs = async (req: AuthRequest, res: Response) => {
  const tenantId = req.user?.tenantId;
  
  try {
    const totalEmployees = await EmployeeModel.countDocuments({ tenantId });
    const avgPerformance = await EmployeeModel.aggregate([
      { $match: { tenantId } },
      { $group: { _id: null, avg: { $avg: "$performanceScore" } } }
    ]);

    res.json({
      success: true,
      data: {
        totalEmployees,
        averagePerformance: avgPerformance[0]?.avg || 0,
        retentionRate: 94.5 // Exemplo de KPI calculado
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const generateAIInsights = async (req: AuthRequest, res: Response) => {
  try {
    const employees = await EmployeeModel.find({ tenantId: req.user?.tenantId }).limit(10);
    
    // Skill de Analytics real (LangChain)
    const insights = await skillService.runSkill('employeeAnalytics', { 
      data: employees 
    });

    res.json({ success: true, insights });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
