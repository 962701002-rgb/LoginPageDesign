import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './index.css'

const theme = {
  token: {
    // Primary — Forest Green (outdoor brand)
    colorPrimary:          '#1A6B44',
    colorPrimaryHover:     '#15874F',
    colorPrimaryActive:    '#10573A',
    colorLink:             '#1A6B44',
    colorLinkHover:        '#15874F',
    colorLinkActive:       '#10573A',
    // Error
    colorError:            '#FF4D4F',
    colorErrorBg:          '#FFF2F0',
    colorErrorBorder:      '#FFCCC7',
    // Text
    colorText:             '#1A1A1A',
    colorTextSecondary:    '#595959',
    colorTextTertiary:     '#8C8C8C',
    colorTextQuaternary:   '#BFBFBF',
    // Border & BG
    colorBorder:           '#D9D9D9',
    colorBorderSecondary:  '#F0F0F0',
    colorBgContainer:      '#FFFFFF',
    colorBgLayout:         '#F5F5F5',
    colorFillSecondary:    '#F5F5F5',
    // Shape
    borderRadius:          6,
    borderRadiusLG:        8,
    borderRadiusSM:        4,
    // Typography
    fontFamily:            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize:              14,
    fontSizeLG:            16,
    fontSizeXL:            20,
    fontSizeHeading1:      38,
    fontSizeHeading2:      30,
    fontSizeHeading3:      24,
    // Sizing
    controlHeight:         40,
    controlHeightLG:       48,
    controlHeightSM:       32,
    // Spacing
    padding:               16,
    paddingLG:             24,
    paddingSM:             12,
    paddingXS:             8,
    margin:                16,
    marginLG:              24,
    marginSM:              12,
    // Motion
    motionDurationMid:     '0.2s',
    // Elevation
    boxShadow:             '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
    boxShadowSecondary:    '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
  },
  components: {
    Button: {
      controlHeight:      40,
      controlHeightLG:    48,
      paddingContentHorizontal: 20,
      defaultBorderColor: '#D9D9D9',
    },
    Input: {
      controlHeight:      40,
      controlHeightLG:    44,
      paddingInline:      12,
      addonBg:            '#FAFAFA',
    },
    Checkbox: {
      controlInteractiveSize: 16,
    },
    Form: {
      itemMarginBottom: 0,
      verticalLabelPadding: '0 0 6px',
    },
    Modal: {
      borderRadiusLG: 12,
    },
    Alert: {
      borderRadiusLG: 6,
    },
    Typography: {
      titleMarginBottom: '0.25em',
      titleMarginTop:    0,
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={theme} locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
