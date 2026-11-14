
import { Router } from 'express';
import multer from 'multer';
import { analyzePlantImage } from '../services/gemini.service.new.js';

export const plantDoctorRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            callback(new Error('Only JPG, PNG and WEBP images are allowed'));
            return;
        }

        callback(null, true);
    },
});

// Full endpoint: POST /api/plant-doctor/analyze
plantDoctorRouter.post(
    '/analyze',
    upload.single('image'),
    async (req, res, next) => {
        try {
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    error: 'Please upload a plant image',
                });
                return;
            }

            const result = await analyzePlantImage(
                req.file.buffer,
                req.file.mimetype,
                req.body.cropName || '',
                req.body.symptoms || ''
            );

            res.json({
                success: true,
                analysis: result,
            });
        } catch (error) {
            next(error);
        }
    }
);
