/* eslint-disable class-methods-use-this */
import { Request, Response } from "express";

export default class HelloWorldController {
  getMessage = (req: Request, res: Response) => {
    res.send("Hello World!");
  };

  getVersion = (req: Request, res: Response) => {
    res.send("1.0.0");
  };
}
