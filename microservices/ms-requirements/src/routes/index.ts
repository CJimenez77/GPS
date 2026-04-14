import { Router } from 'express';
import { empresasController } from '../controllers/EmpresasController.js';

const router = Router();

router.get('/empresas', empresasController.list.bind(empresasController));
router.get('/empresas/inactivas', empresasController.listInactive.bind(empresasController));
router.get('/empresas/:id', empresasController.getById.bind(empresasController));
router.post('/empresas', empresasController.create.bind(empresasController));
router.put('/empresas/:id', empresasController.update.bind(empresasController));
router.delete('/empresas/:id', empresasController.delete.bind(empresasController));
router.patch('/empresas/:id/activar', empresasController.activate.bind(empresasController));

export default router;