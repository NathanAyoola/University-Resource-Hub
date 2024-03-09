import multer from "multer";
import path from 'path';
import express  from "express";
import {Request, Response, NextFunction}  from 'express'
import { logger } from '../utils/logger';
import HttpError from "../utils/httpError";

const app = express();

interface File{
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }

class Multer{
 protected storage;
 protected upload;
    constructor() {
        this.storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, 'uploads/');
            },
            filename: function (req, file, cb) {
              cb(null, Date.now() + '-' + file.originalname);
            }
          });
      
          this.upload = multer({ storage: this.storage });

    }

    uploadOne(req: Request, res: Response, next: NextFunction) {
        const uploadMiddleware = this.upload.single('file');
        uploadMiddleware(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            return res.status(400).send('Multer error: ' + err.message);
          } else if (err) {
            console.error(err)
            return res.status(500).send('Internal server error');
          }
          // Access uploaded file using req.file
          if (!req.file) {
           throw new HttpError('No file uploaded', 400);
          }
          // Process uploaded file as needed
          logger.info('File uploaded successfully.');
          return next();
        });
      }

   
  uploadArray(req: Request, res: Response, next: NextFunction) {
    const uploadMiddleware = this.upload.array('files', 5);
    uploadMiddleware(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send('Multer error: ' + err.message);
      } else if (err) {
        return res.status(500).send('Internal server error');
      }

      // Access uploaded files using req.files
      if (!req.files || req.files.length === 0  ) {
         throw new HttpError('No files uploaded', 400)
      }
     

      // Process uploaded files as needed
      logger.info('File uploaded successfully.')
      return next();
    });
  }
}

export default new Multer();