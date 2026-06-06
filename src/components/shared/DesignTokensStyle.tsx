import { getDesignTokens } from '@/app/actions/design-tokens';

/**
 * Server Component — injeta CSS custom properties no <head> com os tokens
 * salvos no banco. Aplicação instantânea sem rebuild.
 */
export async function DesignTokensStyle() {
  const t = await getDesignTokens();

  const css = `:root {
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
  --radius-sm: ${Math.max(0, Number(t['layout.border-radius']) - 2)}px;
  --radius-md: ${t['layout.border-radius']}px;
  --radius-lg: ${Math.min(24, Number(t['layout.border-radius']) + 2)}px;
}`;

  return (
    <style
      id="vp-design-tokens"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
