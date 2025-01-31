import * as React from 'react'
import * as menu from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const dialog = useStore((state) => state.dialog)
  const panel = useStore((state) => state.panel)
  const clear = useStore((state) => state.clear)
  const updateState = useStore((state) => state.updateState)
  return (
    <menu.MenuBar>
      <menu.EditorButton enabled />
      <menu.MetadataButton enabled />
      <menu.ReportButton
        active={panel === 'report'}
        onClick={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      />
      <menu.SourceButton
        active={panel === 'source'}
        onClick={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      />
      <menu.ChatButton
        onClick={() => updateState({ dialog: dialog !== 'chat' ? 'chat' : undefined })}
      />
      <menu.ClearButton onClick={clear} />
    </menu.MenuBar>
  )
}
