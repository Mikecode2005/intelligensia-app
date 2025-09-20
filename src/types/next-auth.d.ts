import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id */
      id: string;
      /** The user's username */
      username?: string | null;
      /** The user's display name */
      displayName?: string | null;
      /** The user's type (STUDENT, TUTOR, ORGANIZATION) */
      userType?: string;
    } & DefaultSession["user"];
  }

  interface User {
    /** The user's username */
    username?: string | null;
    /** The user's display name */
    displayName?: string | null;
    /** The user's type (STUDENT, TUTOR, ORGANIZATION) */
    userType?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's id */
    id: string;
    /** The user's username */
    username?: string | null;
    /** The user's display name */
    displayName?: string | null;
    /** The user's type (STUDENT, TUTOR, ORGANIZATION) */
    userType?: string;
  }
}