const fs = require('fs');
const path = require('path'); // Importación correcta
const { db } = require('../config/bd.config');

const guardarImagenes = async (image) => {
    try {
        const date = new Date();
        let pathImage = null;

        if (image) {
            const buffer = Buffer.from(image, 'base64');
            const filename = `${date.getFullYear()}-${date.getDate()}${date.getMonth()}${date.getHours()}${date.getMilliseconds()}-producto.png`;
            const uploadDir = path.join(__dirname, 'documents');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);

            fs.writeFileSync(filePath, buffer);
            pathImage = filePath;
        }

        const { id } = await db.oneOrNone(
            `INSERT INTO inventario.imagenes(url) VALUES ('${pathImage}') RETURNING id`,

        );

        return id;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { guardarImagenes };
