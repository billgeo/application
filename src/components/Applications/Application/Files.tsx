import * as React from 'react'
import Empty from '../../Parts/Empty'
import Spinner from '../../Parts/Spinner'
import FileTree from '../../Parts/Trees/File'
import { useStore, selectors } from './store'

export default function Files() {
  const fileItems = useStore((state) => state.fileItems)
  const loading = useStore((state) => state.loading)
  return loading ? <LoadingFiles /> : fileItems.length ? <PresentFiles /> : <EmptyFiles />
}

function LoadingFiles() {
  return <Spinner />
}

function PresentFiles() {
  const path = useStore((state) => state.path)
  const fileTree = useStore(selectors.fileTree)
  const fileEvent = useStore((state) => state.fileEvent)
  const select = useStore((state) => state.select)
  return (
    <React.Fragment>
      <FileTree tree={fileTree} event={fileEvent} selected={path} onSelect={select} />
    </React.Fragment>
  )
}

function EmptyFiles() {
  return <Empty title="No Files Added" description='Use "Create" button to add files' />
}