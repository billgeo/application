import * as React from 'react'
import PublishDialog from './Dialogs/Publish'
import ResourceDialog from './Dialogs/Resource'
import SaveAsDialog from './Dialogs/SaveAs'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  switch (dialog) {
    case 'publish':
      return <PublishDialog />
    case 'resource':
      return <ResourceDialog />
    case 'saveAs':
      return <SaveAsDialog />
    default:
      return null
  }
}