import formidable from 'formidable';
import { Request, Response, NextFunction } from 'express';

export function upload(req: Request, res: Response, next: NextFunction) {
  const form = new formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ fields, files });
  });
}
