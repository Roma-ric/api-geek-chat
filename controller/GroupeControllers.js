// const connection = require("../db/db");
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "geek_chat",
    socketPath: "/opt/lampp/var/mysql/mysql.sock"
});

exports.createGroupe = async (req, res) => {
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
}

exports.updateGroupe = async (req, res) => {
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
}

exports.getAllGroupe = async (req, res) => {
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
}

exports.getGroupe = async (req, res) => {
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
}

exports.deleteGroupe = async (req, res) => {
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
}