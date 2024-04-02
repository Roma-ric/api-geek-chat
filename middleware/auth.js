const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const connection = require("../db/db");
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "geek_chat",
    socketPath: "/opt/lampp/var/mysql/mysql.sock"
});

//Sign Up
exports.signUp = async (req, res, next) => {
    try {
        const { nom, prenom, pseudo, adresseEmail, motDePasse, imgProfil } = req.body;
        const hashedMotDePasse = bcrypt.hash(motDePasse, 10);

        const [result] = await connection.execute(
            `INSERT INTO utilisateur (nom, prenom, pseudo, adresseEmail, motDePasse, imgProfil) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nom, prenom, pseudo, adresseEmail, hashedMotDePasse, imgProfil]
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


//Sign in
exports.signIn = async (req, res, next) => {
    try {
        const { pseudo, motDePasse } = req.body;
        const [rows] = await connection.execute(
            'SELECT * FROM utilisateur WHERE pseudo = ?',
            [adresseEmail]
        );

        // Vérifier si l'utilisateur existe
        if (rows.length === 0) {
            return res.status(401).json({
                message: "Adresse e-mail ou mot de passe incorrect"
            });
        }

        const user = rows[0];

        // Vérifier si le mot de passe correspond
        const passwordMatch = bcrypt.compare(motDePasse, user.motDePasse);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Pseudo ou mot de passe incorrect"
            });
        }

        res.status(200).json({
            message: "Connexion réussie",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Erreur interne du serveur"
        });
    }
}


/*
// Générer un token JWT
    const token = jwt.sign(
        { userId: user.id },
        'votre_clé_secrète', // Remplacez par votre clé secrète
        { expiresIn: '24h' } // Optionnel : délai d'expiration du token
    );

    res.status(200).json({
        message: "Connexion réussie",
        token: token
    });
*/