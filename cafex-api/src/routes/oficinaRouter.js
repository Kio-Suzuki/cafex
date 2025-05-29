import express from "express";
import OficinaController from "../controllers/oficinaController.js";

const router = express.Router();

router.post("/oficinas", OficinaController.createOficina);
router.get("/oficinas", OficinaController.listAllOficinas);
router.get("/oficinas/:id", OficinaController.getOficinaById);
router.put("/oficinas/:id", OficinaController.updateOficina);
router.delete("/oficinas/:id", OficinaController.deleteOficina);

export default router;
