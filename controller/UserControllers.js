// const connection = require("../db/db");
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "geek_chat",
    socketPath: "/opt/lampp/var/mysql/mysql.sock"
}); 

exports.createUser = async (req, res) =>{
    try {
        const { nom, prenom, pseudo, adresseEmail, motDePasse, imgProfil } = req.body;
        // const hashedMotDePasse = bcrypt.hash(motDePasse, 10);
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
}

exports.updateUser = async (req, res) =>{
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
}

exports.getAllUser = async (req, res) =>{
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
}

exports.getUser = async (req, res) =>{
    try {
        const { pseudo } = req.params
        const data = await connection.execute(
            `SELECT * from utilisateur WHERE pseudo = ?`, [pseudo]
        );
        res.status(200).json({
            user: data[0][0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
}

exports.deleteUser = async (req, res) =>{
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
}