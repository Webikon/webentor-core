import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

interface ResponsiveTabPanelProps {
  breakpoints: string[];
  /** Returns true when the breakpoint has at least one active value (renders `*` indicator) */
  hasActiveSettings: (breakpoint: string) => boolean;
  children: (breakpoint: string) => React.ReactNode;
  className?: string;
  /** Resolved twTheme.screens — used for breakpoint tooltip text */
  screens?: Record<string, any>;
}

/**
 * Extracts a human-readable min-width from a Tailwind screen value.
 * Handles plain strings ('768px') and object configs ({ min: '768px' }).
 */
function resolveScreenValue(
  screen: string | Record<string, string> | Record<string, string>[],
): string | null {
  if (typeof screen === 'string') return screen;
  if (Array.isArray(screen)) {
    const entry = screen.find((s) => s.min);
    return entry?.min ?? null;
  }
  if (typeof screen === 'object' && screen !== null) {
    return screen.min ?? screen.raw ?? null;
  }
  return null;
}

function getBreakpointTooltip(
  bp: string,
  screens?: Record<string, any>,
): string {
  if (bp === 'basic') {
    return __('min-width: 0px', 'webentor');
  }
  const raw = screens?.[bp];
  if (!raw) return bp;
  const value = resolveScreenValue(raw);
  return value ? `min-width: ${value}` : bp;
}

/**
 * Inline SVG that renders a breakpoint label as text.
 * Used as TabPanel tab `icon` so WP's built-in tooltip activates
 * (when icon is set, TabPanel shows `title` as the tooltip).
 */
function BreakpointIcon({ label }: { label: string }) {
  const charWidth = 7.5;
  const width = Math.max(20, label.length * charWidth + 6);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} 20`}
      width={width}
      height={20}
    >
      <text
        x={width / 2}
        y={15}
        textAnchor="middle"
        fontSize="13"
        fontWeight="inherit"
        fill="currentColor"
      >
        {label}
      </text>
    </svg>
  );
}

/**
 * Shared responsive breakpoint tab wrapper.
 * Uses icon-based tabs so TabPanel's built-in tooltip shows each
 * breakpoint's min-width value on hover.
 */
export const ResponsiveTabPanel = ({
  breakpoints,
  hasActiveSettings,
  children,
  screens,
  className = 'w-responsive-settings-tabs',
}: ResponsiveTabPanelProps) => {
  return (
    <TabPanel
      activeClass="is-active"
      className={className}
      initialTabName={breakpoints[0]}
      tabs={breakpoints.map((bp) => {
        const active = hasActiveSettings(bp);
        const label = `${bp}${active ? '*' : ''}`;

        return {
          name: bp,
          title: getBreakpointTooltip(bp, screens),
          icon: <BreakpointIcon label={label} />,
        };
      })}
    >
      {(tab) => <>{children(tab.name)}</>}
    </TabPanel>
  );
};
