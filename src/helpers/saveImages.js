
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
var pathName = ""


if (process.platform === 'win32') {
    pathName = path.join(__dirname, `../../../public/imagenesProductos`)
} else {
    pathName = `/archivo/imagenesProductos`
}
if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathName);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Obtiene la extensión del archivo (ejemplo: .png)

        const filename = uuidv4() + ext
        cb(null, filename);
    }
});

const upload = multer({ storage: storage })

module.exports = { upload }