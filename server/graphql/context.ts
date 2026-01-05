import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { User } from '@/types';

const prisma = new PrismaClient();

export interface Context {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  user?: User;
}

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  let user: User | undefined;

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Fetch user from database
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role as any,
          avatar: dbUser.avatar || undefined,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        };
      }
    } catch (error) {
      // Invalid token - user remains undefined
      console.warn('Invalid JWT token:', error);
    }
  }

  return {
    req,
    res,
    prisma,
    user,
  };
}
