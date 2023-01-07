import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { SchemaOf, ValidationError } from "yup";

type TValidation = (scheme: SchemaOf<any>) => RequestHandler;

export const validation: TValidation = (scheme) => async (req, res, next) => {
  console.log("teste");

  try {
    await scheme.validate(req.query, { abortEarly: false });
    return next();
  } catch (err) {
    //Catch Error
    const yupError = err as ValidationError;
    const errors: Record<string, string> = {};

    yupError.inner.forEach((error) => {
      //For Each error === undefined
      if (!error.path) return;

      errors[error.path] = error.message;
    });

    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }
};
