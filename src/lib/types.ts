export type Category = "productos" | "servicios";

export type YaavserAdType =
  | "busco_distribuidor"
  | "ofrezco_servicios"
  | "colaboracion"
  | "promocion"
  | "otro";

export interface YaavserAd {
  id: string;
  type: YaavserAdType;
  title: string;
  message: string;
  authorName: string;
  location: string;
  whatsapp: string;
  createdAt: string;
  featured?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  location: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  memberSince: string;
  bio: string;
}

export interface ServiceListing {
  id: string;
  title: string;
  description: string;
  category: Category;
  price: number;
  priceType: "fijo" | "desde" | "hora" | "negociable";
  image: string;
  images: string[];
  provider: Provider;
  tags: string[];
  featured: boolean;
  createdAt: string;
  views: number;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  description: string;
  icon: string;
  color: string;
}
