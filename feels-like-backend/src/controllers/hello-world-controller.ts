/* eslint-disable class-methods-use-this */
import { Request, Response } from "express";
import createHttpError from "http-errors";

export default class HelloWorldController {
  getMessage = (req: Request, res: Response) => {
    res.send("Hello World!");
  };

  getVersion = (req: Request, res: Response) => {
    res.send("1.0.0");
  };

  notFound = (req: Request, res: Response) => {
    throw createHttpError(404, "Oops! Not found");
  };
}
