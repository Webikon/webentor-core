import { TabPanel } from '@wordpress/components';

interface ResponsiveTabPanelProps {
  breakpoints: string[];
  /** Returns true when the breakpoint has at least one active value (renders `*` indicator) */
  hasActiveSettings: (breakpoint: string) => boolean;
  children: (breakpoint: string) => React.ReactNode;
  className?: string;
}

/**
 * Shared responsive breakpoint tab wrapper.
 * Replaces the duplicated TabPanel + breakpoint mapping in every settings panel.
 */
export const ResponsiveTabPanel = ({
  breakpoints,
  hasActiveSettings,
  children,
  className = 'w-responsive-settings-tabs',
}: ResponsiveTabPanelProps) => {
  return (
    <TabPanel
      activeClass="is-active"
      className={className}
      initialTabName={breakpoints[0]}
      tabs={breakpoints.map((bp) => ({
        name: bp,
        title: `${bp}${hasActiveSettings(bp) ? '*' : ''}`,
      }))}
    >
      {(tab) => <>{children(tab.name)}</>}
    </TabPanel>
  );
};
