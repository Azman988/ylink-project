import multer from 'multer';

// Store files in memory as Buffer objects
const storage = multer.memoryStorage();

// Allow maximum 5MB per file to prevent server overload
export const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed.'));
        }
    }
});