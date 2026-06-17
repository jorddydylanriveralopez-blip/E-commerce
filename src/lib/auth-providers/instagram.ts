import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

interface InstagramProfile {
  user_id?: string;
  id?: string;
  username?: string;
  name?: string;
  profile_picture_url?: string;
}

export function Instagram(
  options: OAuthUserConfig<InstagramProfile>
): OAuthConfig<InstagramProfile> {
  return {
    ...options,
    id: "instagram",
    name: "Instagram",
    type: "oauth",
    checks: ["state"],
    authorization: {
      url: "https://www.instagram.com/oauth/authorize",
      params: {
        scope: "instagram_business_basic",
        response_type: "code",
      },
    },
    token: "https://api.instagram.com/oauth/access_token",
    userinfo: {
      url: "https://graph.instagram.com/me",
      params: { fields: "user_id,username,name,profile_picture_url" },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    profile(profile) {
      return {
        id: String(profile.user_id ?? profile.id ?? profile.username),
        name: profile.name ?? profile.username ?? "Usuario Instagram",
        email: null,
        image: profile.profile_picture_url ?? null,
      };
    },
    style: { bg: "#E4405F", text: "#fff" },
  };
}
