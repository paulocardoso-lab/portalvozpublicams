const SETTING_ALIASES: Record<string, string[]> = {
  SOCIAL_FACEBOOK: ["SOCIAL_FB"],
  SOCIAL_FACEBOOK_ENABLED: ["SOCIAL_FB_ENABLED"],
  SOCIAL_INSTAGRAM: ["SOCIAL_IG"],
  SOCIAL_INSTAGRAM_ENABLED: ["SOCIAL_IG_ENABLED"],
  SOCIAL_TWITTER: ["SOCIAL_X"],
  SOCIAL_TWITTER_ENABLED: ["SOCIAL_X_ENABLED"],
  SOCIAL_YOUTUBE: ["SOCIAL_YT"],
  SOCIAL_YOUTUBE_ENABLED: ["SOCIAL_YT_ENABLED"],
  SOCIAL_WHATSAPP: ["SOCIAL_WA"],
  SOCIAL_WHATSAPP_ENABLED: ["SOCIAL_WA_ENABLED"],
  EMAIL_CONTATO: ["CONTACT_EMAIL"],
};

export function withSettingAliases(settings: Record<string, string>) {
  const normalized = { ...settings };

  for (const [key, aliases] of Object.entries(SETTING_ALIASES)) {
    const primaryValue = normalized[key];

    for (const alias of aliases) {
      if (primaryValue !== undefined && normalized[alias] === undefined) {
        normalized[alias] = primaryValue;
      }

      if (primaryValue === undefined && normalized[alias] !== undefined) {
        normalized[key] = normalized[alias];
      }
    }
  }

  return normalized;
}

export function expandSettingAliases(settings: Record<string, string>) {
  const expanded = { ...settings };

  for (const [key, aliases] of Object.entries(SETTING_ALIASES)) {
    if (expanded[key] === undefined) continue;

    for (const alias of aliases) {
      expanded[alias] = expanded[key];
    }
  }

  return expanded;
}
