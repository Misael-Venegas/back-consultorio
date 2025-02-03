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
            // const uploadDir = path.join(__dirname, 'documents');

            var pathName = ""


            if (process.platform === 'win32') {
                pathName = path.join(__dirname, `../../../public/imagenesProductos`)
            } else {
                pathName = `/archivo/imagenesProductos`
            }
            if (!fs.existsSync(pathName)) {
                fs.mkdirSync(pathName, { recursive: true });
            }

            // const filePath = path.join(uploadDir, filename);
            const rutaCompleta = `${pathName}/${filename}`
            fs.writeFileSync(rutaCompleta, buffer);
            pathImage = pathName;

            const { id } = await db.oneOrNone(
                `INSERT INTO inventario.imagenes(url) VALUES ('${rutaCompleta}') RETURNING id`,
            );

            return id;
        }

    } catch (error) {
        console.log(error)
        throw new Error(error.message);
    }
};

module.exports = { guardarImagenes };
