import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };
    error.message = err.message;

    // Mongoose Bad ObjectId (CastError)
    if (err.name === 'CastError') {
        error.message = `Resource not found with ID of ${err.value}`;
        return res.status(404).json({ success: false, message: error.message });
    }

    // Mongoose Duplicate Key Error (code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `A record with that ${field} already exists.`;
        return res.status(400).json({ success: false, message: error.message });
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
        return res.status(400).json({ success: false, message });
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token authorization' });
    }

    // Catch Multer File Size or Limit Errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum limit is 5MB per image.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }

    // Catch custom File Filter errors (e.g. "Invalid file type")
    if (err.message === 'Invalid file type. Only images are allowed.') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};