import { NextFunction, Request, Response } from 'express';
import httpError from '../utils/httpError';
import httpResponse from '../utils/httpResponse';
import Service from '../services/service';
import { logger } from '../utils/logger';
import safeQuery from '../utils/safeQuery';

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
  abstract service: Service<T>;
  protected safeQuery = safeQuery;
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

    // const x = Array<keyof T>; //TODO:
    if (Object.entries(query).length > 0) {
      for (const [k, v] of Object.entries(query)) {
        if (param[k]) {
          delete query[k];
          // } else {
          //   query[k] = <any>{
          //     $regex: v,
          //     $options: 'i'
          //   };
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