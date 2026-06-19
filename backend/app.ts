import express from "express";
import { db } from "./db.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// 1. API Endpoints

// GET /api/students - Get all mapped students (Admin only view, validated on client side)
app.get("/api/students", async (req, res) => {
  try {
    const students = await db.getStudents();
    res.json(students);
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de la recherche des étudiants : " + e.message });
  }
});

// POST /api/students - Add a student from the census form
app.post("/api/students", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      city,
      university,
      course,
      degree,
      scholarshipType,
      arrivalYear,
      gender,
      passportNumber,
      passportExpiry,
      residenceCardNumber,
      residenceCardExpiry
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !city || !university || !course || !degree || !scholarshipType || !passportNumber) {
      return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires du recensement académique." });
    }



    const newStudent = await db.addStudent({
      fullName,
      email,
      phone,
      city,
      university,
      course,
      degree,
      scholarshipType,
      arrivalYear: arrivalYear || new Date().getFullYear().toString(),
      gender: gender || "M",
      passportNumber,
      passportExpiry: passportExpiry || "2030-01-01",
      residenceCardNumber: residenceCardNumber || "Em Processo",
      residenceCardExpiry: residenceCardExpiry || "2026-12-31"
    });

    res.status(201).json({ 
      success: true, 
      message: "Recensement soumis avec grand succès !", 
      student: newStudent 
    });
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement de l'étudiant dans le recensement : " + e.message });
  }
});

// GET /api/tickets - Support tickets (Admin)
app.get("/api/tickets", async (req, res) => {
  try {
    const tickets = await db.getTickets();
    res.json(tickets);
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de la recherche des tickets de support : " + e.message });
  }
});

// POST /api/tickets - Submit support ticket (Student)
app.post("/api/tickets", async (req, res) => {
  try {
    const { category, description, studentName, email } = req.body;

    if (!category || !description || !studentName || !email) {
      return res.status(400).json({ error: "Champs obligatoires manquants pour enregistrer le ticket." });
    }

    const newTicket = await db.addTicket({
      category,
      description,
      studentName,
      email
    });

    res.status(201).json({
      success: true,
      message: "Ticket soumis avec succès ! La direction d'ASSEBGUIM Central analysera votre demande dès que possible.",
      ticket: newTicket
    });
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement du ticket de support : " + e.message });
  }
});

// PATCH /api/tickets/:id - Change support ticket status (Admin)
app.patch("/api/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pendente', 'Em Resolução', 'Resolvido'].includes(status)) {
      return res.status(400).json({ error: "Statut invalide fourni." });
    }

    const updated = await db.updateTicketStatus(id, status as any);
    if (!updated) {
      return res.status(404).json({ error: "Ticket de support introuvable." });
    }

    res.json({ success: true, message: "Statut du ticket mis à jour com sucesso !", ticket: updated });
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de la mise à jour do statut du ticket : " + e.message });
  }
});



export default app;
