import { defineMonacoSetup } from '@slidev/types'

export default defineMonacoSetup(() => ({
  editorOptions: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: '"JetBrains Mono", Vazirmatn, monospace',
    fontLigatures: false,
  },
}))
