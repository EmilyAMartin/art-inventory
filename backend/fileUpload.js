import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const uploadDir = process.env.UPLOAD_DIR || '/data/uploads';
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage to process images before saving
const storage = multer.memoryStorage();

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 2 * 1024 * 1024, // Reduced from 5MB to 2MB
	},
	fileFilter: function (req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
			return cb(new Error('Only image files are allowed!'), false);
		}
		cb(null, true);
	},
});

// Middleware to compress and save images
export const compressAndSaveImage = async (req, res, next) => {
	if (!req.file) {
		return next();
	}

	try {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const originalExt = path.extname(req.file.originalname).toLowerCase();
		const filename = `image-${uniqueSuffix}.jpg`; // Always save as JPG for better compression
		const outputPath = path.join(uploadDir, filename);

		// Compress image: max width 1920px, quality 80%, convert to JPEG
		await sharp(req.file.buffer)
			.resize(1920, 1920, {
				fit: 'inside',
				withoutEnlargement: true,
			})
			.jpeg({
				quality: 80,
				progressive: true,
			})
			.toFile(outputPath);

		// Update req.file to reflect the saved file
		req.file.filename = filename;
		req.file.path = outputPath;
		req.file.size = fs.statSync(outputPath).size;

		console.log(`Image compressed and saved: ${filename} (${Math.round(req.file.size / 1024)}KB)`);
		next();
	} catch (error) {
		console.error('Error compressing image:', error);
		return res.status(500).json({
			success: false,
			error: 'Image processing failed',
			message: 'Failed to process uploaded image',
		});
	}
};

export default upload;
