import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { Instagram } from "@/lib/auth-providers/instagram";
import {
  verifyEmailPassword,
  createPhoneUser,
  upsertOAuthUser,
  normalizePhone,
  findUserByPhone,
  findUserById,
} from "@/lib/users-store";
import { verifyOtp } from "@/lib/otp-store";

const oauthProviders = [
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          authorization: { params: { prompt: "select_account" } },
        }),
      ]
    : []),
  ...(process.env.INSTAGRAM_CLIENT_ID && process.env.INSTAGRAM_CLIENT_SECRET
    ? [
        Instagram({
          clientId: process.env.INSTAGRAM_CLIENT_ID,
          clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        }),
      ]
    : []),
  ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
    ? [
        Facebook({
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
      ]
    : []),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/entrar",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    ...oauthProviders,
    Credentials({
      id: "email",
      name: "Correo electrónico",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        const user = await verifyEmailPassword(email, password);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    Credentials({
      id: "phone",
      name: "Teléfono",
      credentials: {
        phone: { label: "Teléfono", type: "tel" },
        otp: { label: "Código", type: "text" },
      },
      async authorize(credentials) {
        try {
          const phone = normalizePhone((credentials?.phone as string) ?? "");
          const otp = credentials?.otp as string;
          if (!phone || !otp) return null;

          if (!(await verifyOtp(phone, otp))) return null;

          let user = await findUserByPhone(phone);
          if (!user) {
            user = await createPhoneUser(phone);
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("phone authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const provider = account?.provider;
      if (
        user.id &&
        (provider === "facebook" || provider === "google" || provider === "instagram")
      ) {
        await upsertOAuthUser({
          id: user.id,
          name: user.name ?? "Yaavser",
          email: user.email ?? undefined,
          image: user.image ?? undefined,
          provider: provider as "facebook" | "google" | "instagram",
        });
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider ?? "email";
        token.name = user.name;
        token.picture = user.image;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name as string;
        if (session.image) token.picture = session.image as string;
        if (session.whatsapp) token.whatsapp = session.whatsapp as string;
        if (session.bio !== undefined) token.bio = session.bio as string;
        if (session.birthDate !== undefined) token.birthDate = session.birthDate as string;
      }

      const shouldSyncFromDb =
        Boolean(user) ||
        trigger === "update" ||
        (token.id && token.whatsapp === undefined);

      if (shouldSyncFromDb && token.id) {
        const dbUser = await findUserById(token.id as string);
        if (dbUser) {
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.whatsapp = dbUser.whatsapp ?? dbUser.phone;
          token.phone = dbUser.phone;
          token.bio = dbUser.bio;
          token.birthDate = dbUser.birthDate;
          token.sellerRating = dbUser.sellerRating ?? 5;
          token.sellerReviewCount = dbUser.sellerReviewCount ?? 0;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string | undefined;
        session.user.provider = token.provider as string;
        session.user.whatsapp = token.whatsapp as string | undefined;
        session.user.phone = token.phone as string | undefined;
        session.user.bio = token.bio as string | undefined;
        session.user.birthDate = token.birthDate as string | undefined;
        session.user.sellerRating = (token.sellerRating as number) ?? 5;
        session.user.sellerReviewCount = (token.sellerReviewCount as number) ?? 0;
      }
      return session;
    },
  },
});
