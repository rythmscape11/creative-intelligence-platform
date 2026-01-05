import { DefaultSession, DefaultUser } from 'next-auth';
import { UserRole } from './index';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string;
      role: UserRole;
      rememberMe?: boolean;
    };
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    role: UserRole;
    rememberMe?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    rememberMe?: boolean;
  }
}
