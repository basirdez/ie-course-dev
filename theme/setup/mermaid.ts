import { defineMermaidSetup } from '@slidev/types'
export default defineMermaidSetup(() => ({
  theme: 'base',
  fontFamily: 'Vazirmatn, Tahoma, sans-serif',
  themeVariables: { primaryColor: '#F3F3F3', primaryBorderColor: '#C8C8C8', lineColor: '#3B3B3B', textColor: '#1F1F1F', actorBkg: '#F3F3F3', actorBorder: '#007ACC', signalColor: '#3B3B3B' },
  sequence: { mirrorActors: false, useMaxWidth: false, messageFontSize: 20, actorFontSize: 19, messageMargin: 22, boxMargin: 6, height: 44, width: 150, actorMargin: 40 },
}))
