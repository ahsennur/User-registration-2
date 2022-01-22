import { Request } from "express"
import express from "express"

import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user: string;
    useragent: string;
  }
}

declare module "express-serve-static-core" { 
  export interface Request {

    userId: string| undefined;
  }
}

// declare module 'jsonwebtoken'
//   export interface JwtPayload {
//     _id: string
//   }
