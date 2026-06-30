import express from "express";
import { db, supabase } from "./db.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const verifyAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "Accès refusé. Token manquant." });
  }
  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  try {
    const adminPass = await db.getAdminPassword();
    if (token === adminPass) {
      return next();
    }
  } catch (err) {
    const adminPass = process.env.ADMIN_PASSWORD || "asegbm2026";
    if (token === adminPass) {
      return next();
    }
  }
  return res.status(401).json({ error: "Accès refusé. Token invalide." });
};

// POST /api/admin/login - Authenticate admin credentials
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || "admin";

  try {
    const adminPass = await db.getAdminPassword();
    if (
      (username === adminUser || username === "admin@asegbm.org") &&
      password === adminPass
    ) {
      return res.json({ success: true, token: `Bearer ${adminPass}` });
    }
  } catch (err) {
    const adminPass = process.env.ADMIN_PASSWORD || "asegbm2026";
    if (
      (username === adminUser || username === "admin@asegbm.org") &&
      password === adminPass
    ) {
      return res.json({ success: true, token: `Bearer ${adminPass}` });
    }
  }
  return res.status(401).json({ error: "Identifiants invalides." });
});

// POST /api/admin/change-password - Change admin password dynamically
app.post("/api/admin/change-password", verifyAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ error: "Le nouveau mot de passe doit comporter au moins 4 caractères." });
  }

  try {
    const adminPass = await db.getAdminPassword();
    if (currentPassword !== adminPass) {
      return res.status(400).json({ error: "Le mot de passe actuel émis est incorrect." });
    }

    await db.setAdminPassword(newPassword);
    return res.json({ success: true, token: `Bearer ${newPassword}` });
  } catch (err: any) {
    return res.status(500).json({ error: "Erreur lors de la mise à jour du mot de passe : " + err.message });
  }
});

// GET /api/students - Get all mapped students (Admin only view, protected)
app.get("/api/students", verifyAdmin, async (req, res) => {
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
      birthDate,
      birthPlace,
      nationality,
      email,
      phone,
      city,
      university,
      course,
      degree,
      scholarshipType,
      arrivalDate,
      gender,
      passportNumber,
      passportExpiry,
      residenceCardNumber,
      residenceCardExpiry,
      consularCardNumber,
      consularCardExpiry
    } = req.body;

    // Todos os campos são opcionais agora


    const newStudent = await db.addStudent({
      fullName,
      birthDate,
      birthPlace: birthPlace || "",
      nationality: nationality || "",
      email,
      phone,
      city,
      university,
      course,
      degree,
      scholarshipType,
      arrivalDate: arrivalDate || "",
      gender: gender || "M",
      passportNumber,
      passportExpiry: passportExpiry || "",
      residenceCardNumber: residenceCardNumber || "",
      residenceCardExpiry: residenceCardExpiry || "",
      consularCardNumber: consularCardNumber || "",
      consularCardExpiry: consularCardExpiry || ""
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

// PUT /api/students/:id - Update student details (Admin only, protected)
app.put("/api/students/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updated = await db.updateStudent(id, updateFields);
    if (!updated) {
      return res.status(404).json({ error: "Étudiant introuvable." });
    }

    res.json({ success: true, message: "Fiche étudiant mise à jour avec succès !", student: updated });
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de la fiche étudiant : " + e.message });
  }
});

// DELETE /api/students/:id - Delete a student (Admin only, protected)
app.delete("/api/students/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteStudent(id);
    res.json({ success: true, message: "Fiche étudiant supprimée avec succès !" });
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de la suppression de la fiche étudiant : " + e.message });
  }
});

// GET /api/tickets - Support tickets (Admin)
app.get("/api/tickets", verifyAdmin, async (req, res) => {
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
    const { category, description, studentName, email, phone } = req.body;

    if (!category || !description || !studentName || !email) {
      return res.status(400).json({ error: "Champs obligatoires manquants pour enregistrer le ticket." });
    }

    const newTicket = await db.addTicket({
      category,
      description,
      studentName,
      email,
      phone
    });

    res.status(201).json({
      success: true,
      message: "Ticket soumis avec succès ! Les services consulaires de l'Ambassade analyseront votre demande dès que possible.",
      ticket: newTicket
    });
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement du ticket de support : " + e.message });
  }
});

// PATCH /api/tickets/:id - Change support ticket status (Admin)
app.patch("/api/tickets/:id", verifyAdmin, async (req, res) => {
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

// DELETE /api/tickets/:id - Delete support ticket permanently (Admin)
app.delete("/api/tickets/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteTicket(id);
    if (!deleted) {
      return res.status(404).json({ error: "Ticket de support introuvable." });
    }
    res.json({ success: true, message: "Ticket supprimé définitivement !" });
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de la suppression du ticket : " + e.message });
  }
});
// GET /api/announcements - Get all active announcements (Public)
app.get("/api/announcements", async (req, res) => {
  try {
    const announcements = await db.getAnnouncements();
    res.json(announcements);
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de la recherche des communiqués : " + e.message });
  }
});

// POST /api/announcements - Add a new announcement (Admin only, protected)
app.post("/api/announcements", verifyAdmin, async (req, res) => {
  try {
    const { title, content, fileData, fileName } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Le titre et le contenu sont obligatoires." });
    }

    let attachmentUrl: string | null = null;
    let attachmentName: string | null = null;

    if (fileData && fileName) {
      const matches = fileData.match(/^data:(.+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Format de fichier invalide." });
      }

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const uniqueFileName = `${Date.now()}_${fileName.replace(/\s+/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("announcements")
        .upload(uniqueFileName, buffer, {
          contentType: contentType,
          duplex: "half"
        });

      if (uploadError) {
        return res.status(500).json({ error: "Erreur lors du téléchargement du fichier : " + uploadError.message });
      }

      const { data: publicUrlData } = supabase.storage
        .from("announcements")
        .getPublicUrl(uniqueFileName);

      attachmentUrl = publicUrlData.publicUrl;
      attachmentName = fileName;
    }

    const newAnnouncement = await db.addAnnouncement({
      title,
      content,
      attachment_url: attachmentUrl,
      attachment_name: attachmentName
    });
    res.status(201).json({ success: true, message: "Communiqué publié avec succès !", announcement: newAnnouncement });
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de la publication du communiqué : " + e.message });
  }
});

// DELETE /api/announcements/:id - Delete an announcement (Admin only, protected)
app.delete("/api/announcements/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteAnnouncement(id);
    res.json({ success: true, message: "Communiqué supprimé avec succès !" });
  } catch (e: any) {
    res.status(500).json({ error: "Erreur lors de la suppression du communiqué : " + e.message });
  }
});

// GET /api/ping - Public health check route to keep Supabase database active
app.get("/api/ping", async (req, res) => {
  try {
    await db.ping();
    res.json({ status: "ok", message: "Ambassade API and Supabase Database are active." });
  } catch (e: any) {
    res.status(500).json({ error: "Database communication failed: " + e.message });
  }
});

export default app;
