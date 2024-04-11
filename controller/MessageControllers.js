// const connection = require("../db/db");
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "geek_chat",
    socketPath: "/opt/lampp/var/mysql/mysql.sock"
});

exports.createMessage = async (req, res) => {
    try {
        const { texte, idGroupe, pseudoUser } = req.body;
        const result = await connection.execute(
            `INSERT INTO message (texte, idGroupe, pseudoUser) 
            VALUES (?,?,?)`,
            [texte, idGroupe, pseudoUser]
        );
        const insertId = result[0].insertId;

        // Récupérez l'id du message
        const newMessageId = await connection.execute(
            `SELECT idMessage FROM message WHERE idMessage = ? AND pseudoUser = ? AND idGroupe = ?`,
            [texte, pseudoUser, idGroupe]
        );

        // Récupérez le message 
        const [newMessage] = await connection.execute(
            `SELECT * FROM message WHERE idMessage = ?`,
            [newMessageId]
        );

        res.status(201).json(newMessage[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.updateMessage = async (req, res) => {
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

        // Récupérez le message modifié depuis la base de données
        const [updatedMessage] = await connection.execute(
            `SELECT * FROM message WHERE idMessage = ?`,
            [idMessage]
        );

        res.status(200).json(updatedMessage[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

exports.getAllMessageGroupe = async (req, res) => {
    try {
        // const { idGroupe } = req.params;
        const data = await connection.execute(
            `SELECT *  from message`,
            // WHERE idGroupe = ? [idGroupe]
        );
        res.status(202).json({
            messages: data[0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
}

exports.getMessage = async (req, res) => {
    try {
        const { idMessage } = req.params
        const data = await connection.execute(
            `SELECT * from message WHERE idMessage = ?`, [idMessage]
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

exports.deleteMessage = async (req, res) => {
    try {
        const { idMessage } = req.params;

        // Récupérez le message 
        const [oldMessage] = await connection.execute(
            `SELECT * FROM message WHERE idMessage = ?`,
            [idMessage]
        );

        await connection.execute(
            `DELETE FROM message WHERE idMessage = ?`,
            [idMessage]
        );

        res.status(200).json(oldMessage[0]);
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
}