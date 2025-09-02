import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const uploadDir = process.env.UPLOAD_DIR || '/data/uploads';
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Create subdirectories for different image sizes
const sizes = {
	thumbnail: 150,
	medium: 800,
	large: 1200,
};

Object.values(sizes).forEach((size) => {
	const sizeDir = path.join(uploadDir, size.toString());
	if (!fs.existsSync(sizeDir)) {
		fs.mkdirSync(sizeDir, { recursive: true });
	}
});

const storage = multer.memoryStorage(); // Use memory storage for processing

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

// Process and save images in multiple sizes
export const processAndSaveImage = async (file, baseFilename) => {
	const imagePaths = {};

	try {
		const image = sharp(file.buffer);
		const metadata = await image.metadata();

		// Save original (compressed)
		const originalPath = path.join(uploadDir, baseFilename);
		await image.jpeg({ quality: 85, progressive: true }).toFile(originalPath);
		imagePaths.original = baseFilename;

		// Create and save different sizes
		for (const [sizeName, maxDimension] of Object.entries(sizes)) {
			const sizeDir = path.join(uploadDir, maxDimension.toString());
			const sizeFilename = `${
				path.parse(baseFilename).name
			}-${maxDimension}${path.extname(baseFilename)}`;
			const sizePath = path.join(sizeDir, sizeFilename);

			await image
				.resize(maxDimension, maxDimension, {
					fit: 'inside',
					withoutEnlargement: true,
				})
				.jpeg({ quality: 80, progressive: true })
				.toFile(sizePath);

			imagePaths[sizeName] = `${maxDimension}/${sizeFilename}`;
		}

		return imagePaths;
	} catch (error) {
		console.error('Error processing image:', error);
		throw error;
	}
};

export default upload;
