import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});






// Final multer upload middleware
export const upload = multer(
    {
        storage,
    }
);
