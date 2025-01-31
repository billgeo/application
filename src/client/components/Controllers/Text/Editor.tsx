import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import SpinnerCard from '../../Parts/Cards/Spinner'
import TextEditor from '../../Editors/Text'
import { useStore, selectors } from './store'
import * as helpers from './helpers'

export default function Editor() {
  const type = useStore((state) => state.record?.type)
  if (type !== 'article' && type !== 'script') return <Source />
  return (
    <Columns spacing={2} height="100%">
      <Source />
      <Target />
    </Columns>
  )
}

function Source() {
  const [visibility, setVisibility] = React.useState('hidden')
  const modifiedText = useStore((state) => state.modifiedText)
  const editorRef = useStore((state) => state.editorRef)
  const language = useStore(selectors.language)
  const updateState = useStore((state) => state.updateState)
  const maximalVersion = useStore((state) => state.maximalVersion)
  const render = useStore((state) => state.render)
  if (modifiedText === undefined) return null
  return (
    <React.Fragment>
      {visibility === 'hidden' && <SpinnerCard message="Loading" />}
      <Box sx={{ paddingY: 2, height: '100%', visibility }}>
        <TextEditor
          value={modifiedText}
          language={language}
          onChange={(text) => {
            const version = helpers.getVersion(editorRef.current)
            updateState({
              modifiedText: text,
              currentVersion: version,
              maximalVersion: Math.max(version, maximalVersion),
            })
            render()
          }}
          onMount={(editor) => {
            // @ts-ignore
            editorRef.current = editor
            setVisibility('visible')
          }}
        />
      </Box>
    </React.Fragment>
  )
}

function Target() {
  const type = useStore((state) => state.record?.type)
  const outputedText = useStore((state) => state.outputedText)
  return (
    <Box sx={{ paddingX: 2, borderLeft: 'solid 1px #ddd', height: '100%' }}>
      {type === 'script' ? (
        <pre>
          <code>{outputedText}</code>
        </pre>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: outputedText || '' }}></div>
      )}
    </Box>
  )
}
