import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
      whatsapp?: string;
      phone?: string;
      bio?: string;
      birthDate?: string;
      sellerRating?: number;
      sellerReviewCount?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    provider?: string;
    whatsapp?: string;
    phone?: string;
    bio?: string;
    birthDate?: string;
    sellerRating?: number;
    sellerReviewCount?: number;
  }
}
