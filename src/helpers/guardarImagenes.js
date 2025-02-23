const fs = require('fs');
const path = require('path'); // Importación correcta
const { db } = require('../config/bd.config');

const guardarImagenes = async (imagePath) => {
    try {


        if (imagePath) {

            const { id } = await db.oneOrNone(
                `INSERT INTO inventario.imagenes(url) VALUES ('${imagePath}') RETURNING id`,
            );

            return id;
        }

    } catch (error) {
        console.log(error)
        throw new Error(error.message);
    }
};

module.exports = { guardarImagenes };
