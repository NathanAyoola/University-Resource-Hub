import { NextFunction, Request, Response } from 'express';
import httpError from '../utils/httpError';
import httpResponse from '../utils/httpResponse';
import Service from '../services/service';
import { logger } from '../utils/logger';
import safeQuery from '../utils/safeQuery';
import multer from '../helpers/multer';

declare global {
    interface String {
      toPlural(): string;
    }
  }
  
  
export default abstract class Controller<T> {
  protected HttpError = httpError;
  protected HttpResponse = httpResponse;
  protected resource: string;
  protected resourceId: string;
  protected multer = multer;
  abstract service: Service<T>;
  protected safeQuery = safeQuery;
  
  

  protected processFiles = (req: Request) => {
    if (req['file']) {
      req['body'][req.file.fieldname] = (<any>req.file).location;
    }
    if (req['files']) {
      const data = (<Express.Multer.File[]>req.files).map((file) => {
        return (<any>file).location;
      });
      let currentFile = null
      if (Array.isArray(req.files)){
      currentFile = req.files[0]  
      }else{
        currentFile = req.file
      }
      (<any>req['body']).$push = {
        [currentFile!.fieldname as string]: { $each: data }
      };
    }
}
  protected paginate = async (
    req: Request,
    service: Service<T>,
    param = <any>{}
  ) => {
    const query = safeQuery(req);
    const page: number = 'page' in query ? parseInt(query.page) : 1;
    if ('page' in query) {
      delete query.page;
    }
    const limit: number = 'limit' in query ? parseInt(query.limit) : 10;
    if ('limit' in query) {
      delete query.limit;
    }
    const startIndex = limit * (page - 1);

    if (Object.entries(query).length > 0) {
      for (const [k, v] of Object.entries(query)) {
        if (param[k]) {
          delete query[k];
      
        }
      }
      Object.assign(param, query);
    }
    const totalDocs = await service.count(param);
    const totalPages = Math.floor(totalDocs / limit) + 1;
    const docs = await service
      .find(param)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .lean();

    return {
      [this.resource.toPlural()]: docs,
      limit,
      totalDocs,
      page,
      totalPages
    };
  };
  constructor(resource: string) {
    this.resource = resource;
    this.resourceId = `${resource}Id`;
    this.multer = multer
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = <T>req[`body`];
      const result = await this.service.create(data);

      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.paginate(req, this.service);
      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req['params'][this.resourceId]);
      if (!result) throw new this.HttpError(`${this.resource} not found`, 404);
      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };

  load = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.load(
        req['params'][this.resourceId],
        req.body
      );
      if (!result) throw new this.HttpError(`${this.resource} not found`, 404);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.processFiles(req);

      const result = await this.service.update(
        req['params'][this.resourceId],
        req['body']
      );

      if (!result) throw new this.HttpError(`${this.resource} not found`, 404);
      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.delete(req['params'][this.resourceId]);
      if (!result) throw new this.HttpError(`${this.resource} not found`, 404);
      this.HttpResponse.send(res, result);
    } catch (error) {
      logger.error([error]);
      next(error);
    }
  };
}