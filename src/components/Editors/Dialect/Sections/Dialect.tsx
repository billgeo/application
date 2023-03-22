import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/InputField'
import YesNoField from '../../../Parts/Fields/YesNoField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import * as settings from '../../../../settings'
import { useStore } from '../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Dialect" onHeadingClick={() => updateHelp('dialect')}>
      <Columns spacing={3}>
        <Box>
          <Title />
          <Description />
          <CommentChar />
          <CommentRows />
        </Box>
        <Box>
          <Header />
          <HeaderRows />
          <HeaderJoin />
          <HeaderCase />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('dialect/title')}
      onChange={(value) => updateDescriptor({ title: value || undefined })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.description)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onFocus={() => updateHelp('dialect/description')}
      onChange={(value) => updateDescriptor({ description: value || undefined })}
    />
  )
}

function CommentChar() {
  const commentChar = useStore((state) => state.descriptor.commentChar)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Comment Char"
      value={commentChar || settings.DEFAULT_COMMENT_CHAR}
      onChange={(commentChar) => updateDescriptor({ commentChar })}
    />
  )
}

function CommentRows() {
  const commentRows = useStore((state) => state.descriptor.commentRows)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Comment Rows"
      value={(commentRows || []).join(',')}
      onFocus={() => updateHelp('schema/commentRows')}
      onChange={(value) =>
        updateDescriptor({ commentRows: value ? value.split(',') : undefined })
      }
    />
  )
}

function Header() {
  const header = useStore((state) => state.descriptor.header)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <YesNoField
      label="Header"
      value={header || settings.DEFAULT_HEADER}
      onFocus={() => updateHelp('dialect/header')}
      onChange={(header) => updateDescriptor({ header })}
    />
  )
}

function HeaderRows() {
  const headerRows = useStore((state) => state.descriptor.headerRows)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Header Rows"
      value={headerRows}
      onChange={(headerRows) => updateDescriptor({ headerRows })}
    />
  )
}

function HeaderJoin() {
  const headerJoin = useStore((state) => state.descriptor.headerJoin)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Header Join"
      value={headerJoin}
      onChange={(headerJoin) => updateDescriptor({ headerJoin })}
    />
  )
}

function HeaderCase() {
  const headerCase = useStore((state) => state.descriptor.headerCase)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <YesNoField
      label="Header Case"
      value={headerCase || settings.DEFAULT_HEADER_CASE}
      onChange={(headerCase) => updateDescriptor({ headerCase })}
    />
  )
}