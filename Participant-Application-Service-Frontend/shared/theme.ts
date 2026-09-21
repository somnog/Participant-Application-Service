import type { ThemeConfig } from 'antd';

/** One place for the look of the whole app. */
export const BRAND = '#1f4e79';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: BRAND,
    colorInfo: BRAND,
    borderRadius: 10,
    fontFamily: "Inter, 'Segoe UI', Roboto, Arial, sans-serif",
    colorBgLayout: '#f4f6f9',
  },
  components: {
    Layout: { siderBg: '#0f2a43', headerBg: '#ffffff', headerHeight: 60, headerPadding: '0 24px' },
    Menu: {
      darkItemBg: '#0f2a43',
      darkItemSelectedBg: '#1f4e79',
      darkItemHoverBg: '#17395a',
      itemHeight: 44,
      itemBorderRadius: 8,
    },
    Card: { headerFontSize: 15 },
    Table: { headerBg: '#f7f9fc', headerColor: '#44546a', rowHoverBg: '#f5f9ff' },
  },
};
