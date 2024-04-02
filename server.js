const express = require('express');
const app = express();
const path = require('path'); 

//Importer les routes
const UserRoutes = require("./routes/UserRoutes");
const MessageRoutes = require("./routes/MessageRoutes");
const GroupeRoutes = require("./routes/GroupeRoutes");

//Politique de sécurité CORS (Cross-Origin Resource Sharing)
//Configurer le serveur pour autoriser les requêtes depuis le domaine d'origine de lancement des requêtes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

//Endpoint
//Définir la réponse au request vers l'endPoint /images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/users", UserRoutes);
app.use("/messages", MessageRoutes);
app.use("/groupes", GroupeRoutes);

app.get('/', (req, res) => {
    res.send(" Welcome to Geek Chat API ");
});

app.listen(3010, () => {
    console.log("Server listening in http://localhost:3010")
});

/*
    // CRUD
    // Create User
    app.post("/users", async (req, res) => {
        try {
            const { nom, prenom, pseudo, adresseEmail, motDePasse, imgProfil } = req.body;
            const [result] = await connection.execute(
                `INSERT INTO utilisateur (nom, prenom, pseudo, adresseEmail, motDePasse, imgProfil) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [nom, prenom, pseudo, adresseEmail, motDePasse, imgProfil]
            );
            const insertId = result.insertId;
            res.status(201).json({
                message: "Utilisateur créé avec succès",
                userId: insertId
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    });

    // Create Message
    app.post("/messages", async (req, res) => {
        try {
            const { texte } = req.body;
            const [result] = await connection.execute(
                `INSERT INTO message (texte) 
                VALUES (?)`,
                [texte]
            );
            const insertId = result.insertId;
            res.status(201).json({
                message: "Message créé avec succès",
                messageId: insertId
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    });

    // Create Groupe
    app.post("/groupes", async (req, res) => {
        try {
            const { nom } = req.body;
            const [result] = await connection.execute(
                `INSERT INTO groupe (nom) 
                VALUES (?)`,
                [nom]
            );
            const insertId = result.insertId;
            res.status(201).json({
                message: "Groupe créé avec succès",
                groupeId: insertId
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    });

    // Get all users
    app.get("/users", async (req, res) => {
        try {
            const data = await connection.execute(
                `SELECT *  from utilisateur;`
            );
            res.status(202).json({
                users: data[0],
            });
        } catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    });

    // Get all messages for one groupe
    app.get("/messages/:idGroupe", async (req, res) => {
        try {
            const { idGroupe } = req.params;
            const data = await connection.execute(
                `SELECT *  from message WHERE idGroupe = ?`, [idGroupe]
            );
            res.status(202).json({
                messages: data[0],
            });
        } catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    });

    // Get all groupes
    app.get("/groupes", async (req, res) => {
        try {
            const data = await connection.execute(
                `SELECT * from groupe;`
            );
            res.status(202).json({
                groupe: data[0],
            });
        } catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    });

    // Get one user
    app.get("/users/:idUser", async (req, res) => {
        try {
            const { idUser } = req.params
            const data = await connection.execute(
                `SELECT * from utilisateur WHERE idUser = ?`, [idUser]
            );
            res.status(200).json({
                user: data[0][0],
            });
        } catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    });

    // Get one groupe
    app.get("/groupes/:idGroupe", async (req, res) => {
        try {
            const { idGroupe } = req.params
            const data = await connection.execute(
                `SELECT * from groupe WHERE idGroupe = ?`, [idGroupe]
            );
            res.status(200).json({
                user: data[0][0],
            });
        } catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    });

    // Patch one user
    app.patch("/users/:idUser", async (req, res) => {
        try {
            const { idUser } = req.params;
            const { nom, prenom, pseudo, adresseEmail, motDePasse, imgProfil } = req.body;

            let updateFields = [];
            let updateValues = [];

            if (nom) {
                updateFields.push("nom = ?");
                updateValues.push(nom);
            }

            if (prenom) {
                updateFields.push("prenom = ?");
                updateValues.push(prenom);
            }

            if (pseudo) {
                updateFields.push("pseudo = ?");
                updateValues.push(pseudo);
            }

            if (adresseEmail) {
                updateFields.push("adresseEmail = ?");
                updateValues.push(adresseEmail);
            }

            if (motDePasse) {
                updateFields.push("motDePasse = ?");
                updateValues.push(motDePasse);
            }

            if (imgProfil) {
                updateFields.push("imgProfil = ?");
                updateValues.push(imgProfil);
            }

            // Vérifiez s'il y a des champs à mettre à jour
            if (updateFields.length === 0) {
                return res.status(400).json({ message: "No fields to update." });
            }

            // Ajoutez l'idUser à la fin des valeurs à mettre à jour
            updateValues.push(idUser);

            // Exécutez la requête SQL de mise à jour
            await connection.execute(
                `UPDATE utilisateur SET ${updateFields.join(', ')} WHERE idUser = ?`,
                updateValues
            );

            res.status(200).json({
                message: "Utilisateur modifié avec succès",
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });

    // Patch one message
    app.patch("/messages/:idMessage", async (req, res) => {
        try {
            const { idMessage } = req.params;
            const { texte } = req.body;

            let updateFields = [];
            let updateValues = [];

            if (texte) {
                updateFields.push("texte = ?");
                updateValues.push(texte);
            }

            // Vérifiez s'il y a des champs à mettre à jour
            if (updateFields.length === 0) {
                return res.status(400).json({ message: "No fields to update." });
            }

            // Ajoutez l'idMessage à la fin des valeurs à mettre à jour
            updateValues.push(idMessage);

            // Exécutez la requête SQL de mise à jour
            await connection.execute(
                `UPDATE message SET ${updateFields.join(', ')} WHERE idMessage = ?`,
                updateValues
            );

            res.status(200).json({
                message: "Message modifié avec succès",
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });

    // Patch one groupe
    app.patch("/groupes/:idGroupe", async (req, res) => {
        try {
            const { idGroupe } = req.params;
            const { nom } = req.body;

            let updateFields = [];
            let updateValues = [];

            if (nom) {
                updateFields.push("nom = ?");
                updateValues.push(nom);
            }

            // Vérifiez s'il y a des champs à mettre à jour
            if (updateFields.length === 0) {
                return res.status(400).json({ message: "No fields to update." });
            }

            // Ajoutez l'idGroupe à la fin des valeurs à mettre à jour
            updateValues.push(idGroupe);

            // Exécutez la requête SQL de mise à jour
            await connection.execute(
                `UPDATE groupe SET ${updateFields.join(', ')} WHERE idGroupe = ?`,
                updateValues
            );

            res.status(200).json({
                message: "Groupe modifié avec succès",
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });

    // Delete one user
    app.delete("/users/:idUser", async (req, res) => {
        try {
            const { idUser } = req.params;
            await connection.execute(
                `DELETE FROM utilisateur WHERE idUser = ?`,
                [idUser]
            );
            res.status(200).json({
                message: "Utilisateur supprimé",
            });
        } catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    });

    // Delete one message
    app.delete("/messages/:idMessage", async (req, res) => {
        try {
            const { idMessage } = req.params;
            await connection.execute(
                `DELETE FROM message WHERE idMessage = ?`,
                [idMessage]
            );
            res.status(200).json({
                message: "Message supprimé",
            });
        } catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    });

    // Delete one groupe
    app.delete("/groupes/:idGroupe", async (req, res) => {
        try {
            const { idGroupe } = req.params;
            await connection.execute(
                `DELETE FROM groupe WHERE idGroupe = ?`,
                [idGroupe]
            );
            res.status(200).json({
                message: "Groupe supprimé",
            });
        } catch (err) {
            res.status(500).json({
                message: err,
            });
        }
    });
*/