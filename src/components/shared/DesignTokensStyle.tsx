import { getDesignTokens } from '@/app/actions/design-tokens';

/**
 * Server Component — injeta CSS custom properties no <head> com os tokens
 * salvos no banco. Aplicação instantânea sem rebuild.
 */
export async function DesignTokensStyle() {
  const t = await getDesignTokens();

  const r = (key: string) => Number(t[key as keyof typeof t]) || 0;

  const css = `:root {
  /* Colors */
  --vp-bg: ${t['color.bg']};
  --vp-surface: ${t['color.surface']};
  --vp-surface-2: ${t['color.surface-2']};
  --vp-surface-3: ${t['color.surface-3']};
  --vp-border: ${t['color.border']};
  --vp-border-2: ${t['color.border-2']};
  --vp-text: ${t['color.text']};
  --vp-text-2: ${t['color.text-2']};
  --vp-text-3: ${t['color.text-3']};
  --vp-text-4: ${t['color.text-4']};
  --vp-accent: ${t['color.accent']};
  --vp-accent-hover: ${t['color.accent-hover']};
  --vp-accent-soft: ${t['color.accent']}1f;
  --vp-urgent: ${t['color.urgent']};
  --vp-live: ${t['color.urgent']};
  --vp-ok: #7aa37a;

  /* Radii */
  --radius-sm: ${Math.max(0, r('layout.border-radius') - 2)}px;
  --radius-md: ${r('layout.border-radius')}px;
  --radius-lg: ${r('layout.border-radius') + 2}px;

  /* Spacing */
  --vp-spacing-unit: ${r('layout.spacing-unit')}px;
  --vp-header-height: ${r('layout.header-height')}px;
  --vp-sidebar-width: ${r('layout.sidebar-width')}px;
  --vp-content-gap: ${r('layout.content-gap')}px;
  --vp-container-max: ${r('layout.container-max')}px;

  /* Buttons */
  --vp-btn-radius: ${r('comp.btn-radius')}px;
  --vp-btn-font-size: ${r('comp.btn-font-size')}px;
  --vp-btn-font-weight: ${t['comp.btn-font-weight']};
  --vp-btn-px: ${r('comp.btn-padding-x')}px;
  --vp-btn-py: ${r('comp.btn-padding-y')}px;

  /* Cards */
  --vp-card-radius: ${r('comp.card-radius')}px;
  --vp-card-border: ${r('comp.card-border-width')}px;
  --vp-card-gap: ${r('comp.card-gap')}px;

  /* Header */
  --vp-header-logo-size: ${r('comp.header-logo-size')}px;
  --vp-header-nav-size: ${r('comp.header-nav-font-size')}px;
  --vp-header-nav-weight: ${t['comp.header-nav-font-weight']};
  --vp-header-nav-spacing: ${r('comp.header-nav-spacing')}px;
  --vp-header-bg: ${t['comp.header-bg']};
  --vp-header-topbar-bg: ${t['comp.header-topbar-bg']};
  --vp-header-border-color: ${t['comp.header-border-color']};
  --vp-header-topbar-font-size: ${r('comp.header-topbar-font-size')}px;

  /* Footer */
  --vp-footer-logo-size: ${r('comp.footer-logo-size')}px;
  --vp-footer-bg: ${t['comp.footer-bg']};
  --vp-footer-text: ${t['comp.footer-text-color']};
  --vp-footer-border: ${t['comp.footer-border-color']};
  --vp-footer-border-w: ${r('comp.footer-border-width')}px;
  --vp-footer-py: ${r('comp.footer-padding-y')}px;

  --vp-admin-logo-size: ${r('comp.admin-logo-size')}px;
  --vp-compact-logo-size: ${r('comp.compact-logo-size')}px;

  /* Article */
  --vp-article-max: ${r('comp.article-max-width')}px;
  --vp-article-font-size: ${r('comp.article-font-size')}px;
  --vp-article-text-align: ${t['comp.article-text-align']};
  --vp-article-gap: ${r('comp.article-paragraph-gap')}px;
}`;

  return (
    <style
      id="vp-design-tokens"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
