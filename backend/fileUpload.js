import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
	fileFilter: function (req, file, cb) {
		// Accept images only
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return cb(new Error('Only image files are allowed!'), false);
		}
		cb(null, true);
	},
});

export default upload;
