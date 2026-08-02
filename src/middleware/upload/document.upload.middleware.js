const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const {
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE
} = require("../../modules/document/document.constants");


const storage = multer.diskStorage({
    destination: "uploads/documents/",

    filename: (req, file, cb) => {
        const filename =
            `${crypto.randomBytes(16).toString("hex")}-${Date.now()}${path.extname(file.originalname)}`;

        cb(null, filename);
    }
});


const fileFilter = (req, file, cb) => {

    const isAllowed = ALLOWED_FILE_TYPES.includes(file.mimetype);

    if (!isAllowed) {
        return cb(new Error("File type not allowed"), false);
    }

    cb(null, true);
};


module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});