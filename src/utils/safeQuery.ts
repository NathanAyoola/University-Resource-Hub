import { Request } from 'express';

export default function safeQuery<T extends string>(
  q: Request
): { [k in T]: string } {
  return q.query as any;
}