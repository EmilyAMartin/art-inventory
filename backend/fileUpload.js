import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log('Upload directory:', uploadDir);
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const filename =
			file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
		console.log('Generated filename:', filename);
		cb(null, filename);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter: function (req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return cb(new Error('Only image files are allowed!'), false);
		}
		cb(null, true);
	},
});

export default upload;
