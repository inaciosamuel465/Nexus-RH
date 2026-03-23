import { Response } from 'express';
import { AuthRequest } from '../../core/authMiddleware.js';
import { SectorModel } from '../../models/Sector.js';
import { EmployeeModel } from '../../models/Employee.js';

export const listSectors = async (req: AuthRequest, res: Response) => {
  try {
    const sectors = await SectorModel.find({ tenantId: req.user?.tenantId })
      .populate('leaderId', 'name email')
      .populate('bestEmployeeId', 'name');
    res.json({ success: true, sectors });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSectorStats = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const sector = await SectorModel.findById(id)
      .populate('leaderId', 'name')
      .populate('bestEmployeeId', 'name');
      
    if (!sector) return res.status(404).json({ error: 'Setor não encontrado.' });

    const employees = await EmployeeModel.find({ sectorId: id });

    res.json({
      success: true,
      sector,
      employeeCount: employees.length,
      employees: employees.map(e => ({ name: e.name, role: e.role, performance: e.performanceScore }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createSector = async (req: AuthRequest, res: Response) => {
  const { name, leaderId, trainings, productivity } = req.body;
  try {
    const sector = new SectorModel({
      tenantId: req.user?.tenantId,
      name,
      leaderId,
      trainings,
      productivity
    });
    await sector.save();
    res.json({ success: true, sector });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
