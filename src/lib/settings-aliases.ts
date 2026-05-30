const SETTING_ALIASES: Record<string, string[]> = {
  SOCIAL_FACEBOOK: ["SOCIAL_FB"],
  SOCIAL_INSTAGRAM: ["SOCIAL_IG"],
  SOCIAL_TWITTER: ["SOCIAL_X"],
  SOCIAL_YOUTUBE: ["SOCIAL_YT"],
  SOCIAL_WHATSAPP: ["SOCIAL_WA"],
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
