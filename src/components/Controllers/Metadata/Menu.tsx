import * as React from 'react'
import MenuBar from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  const clear = useStore((state) => state.clear)
  return (
    <MenuBar
      items={['editor', 'metadata', 'report', 'source', 'clear']}
      colors={{
        editor: 'info',
        metadata: 'info',
        report: panel === 'report' ? 'warning' : undefined,
        source: panel === 'source' ? 'warning' : undefined,
      }}
      onEditor={() => {}}
      onMetadata={() => {}}
      onReport={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      onSource={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      onClear={clear}
    />
  )
}
