export interface DesignTokens {
  // Colors
  'color.bg': string;
  'color.surface': string;
  'color.surface-2': string;
  'color.surface-3': string;
  'color.border': string;
  'color.border-2': string;
  'color.text': string;
  'color.text-2': string;
  'color.text-3': string;
  'color.text-4': string;
  'color.accent': string;
  'color.accent-hover': string;
  'color.urgent': string;
  // Typography
  'type.font-display': string;
  'type.font-serif': string;
  'type.font-sans': string;
  'type.font-mono': string;
  'type.size-base': string;
  'type.line-height': string;
  // Layout / spacing
  'layout.border-radius': string;
  'layout.container-max': string;
  'layout.spacing-unit': string;
  'layout.header-height': string;
  'layout.sidebar-width': string;
  'layout.content-gap': string;
  // Components — buttons
  'comp.btn-radius': string;
  'comp.btn-font-size': string;
  'comp.btn-font-weight': string;
  'comp.btn-padding-x': string;
  'comp.btn-padding-y': string;
  // Components — cards
  'comp.card-radius': string;
  'comp.card-border-width': string;
  'comp.card-image-ratio': string;
  'comp.card-gap': string;
  'comp.card-title-gap': string;
  // Components — header
  'comp.header-logo-size': string;
  'comp.header-logo-padding-y': string;
  'comp.header-nav-font-size': string;
  'comp.header-nav-font-weight': string;
  'comp.header-nav-spacing': string;
  'comp.header-bg': string;
  'comp.header-topbar-bg': string;
  'comp.header-border-color': string;
  'comp.header-topbar-font-size': string;
  'comp.header-sticky': string;
  // Components — footer
  'comp.footer-logo-size': string;
  'comp.footer-bg': string;
  'comp.footer-text-color': string;
  'comp.footer-border-color': string;
  'comp.footer-border-width': string;
  'comp.footer-padding-y': string;
  // Components — brand/logo
  'comp.admin-logo-size': string;
  'comp.compact-logo-size': string;
  // Components — article body
  'comp.article-max-width': string;
  'comp.article-font-size': string;
  'comp.article-text-align': string;
  'comp.article-paragraph-gap': string;
}

export const DEFAULT_TOKENS: DesignTokens = {
  'color.bg': '#1a1a19',
  'color.surface': '#262624',
  'color.surface-2': '#2f2f2d',
  'color.surface-3': '#3a3a37',
  'color.border': '#3a3a37',
  'color.border-2': '#4a4a46',
  'color.text': '#faf9f5',
  'color.text-2': '#d1cfc4',
  'color.text-3': '#8a887f',
  'color.text-4': '#5a5852',
  'color.accent': '#d97757',
  'color.accent-hover': '#c96442',
  'color.urgent': '#e85d4a',
  'type.font-display': 'Playfair Display',
  'type.font-serif': 'Source Serif 4',
  'type.font-sans': 'Inter',
  'type.font-mono': 'JetBrains Mono',
  'type.size-base': '16',
  'type.line-height': '1.5',
  'layout.border-radius': '4',
  'layout.container-max': '1280',
  'layout.spacing-unit': '4',
  'layout.header-height': '56',
  'layout.sidebar-width': '280',
  'layout.content-gap': '32',
  'comp.btn-radius': '2',
  'comp.btn-font-size': '13',
  'comp.btn-font-weight': '600',
  'comp.btn-padding-x': '14',
  'comp.btn-padding-y': '8',
  'comp.card-radius': '2',
  'comp.card-border-width': '1',
  'comp.card-image-ratio': '56',
  'comp.card-gap': '16',
  'comp.card-title-gap': '16',
  'comp.header-logo-size': '48',
  'comp.header-logo-padding-y': '8',
  'comp.header-nav-font-size': '12',
  'comp.header-nav-font-weight': '700',
  'comp.header-nav-spacing': '14',
  'comp.header-bg': '#1a1a19',
  'comp.header-topbar-bg': '#141413',
  'comp.header-border-color': '#3a3a37',
  'comp.header-topbar-font-size': '11',
  'comp.header-sticky': '1',
  'comp.footer-logo-size': '48',
  'comp.footer-bg': '#262624',
  'comp.footer-text-color': '#8a887f',
  'comp.footer-border-color': '#faf9f5',
  'comp.footer-border-width': '2',
  'comp.footer-padding-y': '32',
  'comp.admin-logo-size': '56',
  'comp.compact-logo-size': '32',
  'comp.article-max-width': '720',
  'comp.article-font-size': '18',
  'comp.article-text-align': 'justify',
  'comp.article-paragraph-gap': '24',
};

export interface DesignSnapshot {
  id: string;
  label: string;
  tokens: DesignTokens;
  createdAt: string;
}

export interface ScheduledTheme {
  id: string;
  label: string;
  tokens: DesignTokens;
  scheduledFor: string;
  createdAt: string;
}
