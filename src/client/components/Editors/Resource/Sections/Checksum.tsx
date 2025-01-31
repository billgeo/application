import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/Input'
import EditorSection from '../../Base/Section'
import Columns from '../../../Parts/Grids/Columns'
import { useStore } from '../store'

export default function Resource() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Checksum" onHeadingClick={() => updateHelp('resource/checksum')}>
      <Columns spacing={3}>
        <Box>
          <Hash />
          <Bytes />
        </Box>
        <Box>
          <Fields />
          <Rows />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Hash() {
  const hash = useStore((state) => state.descriptor.hash)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Hash"
      value={hash || ''}
      onFocus={() => updateHelp('resource/checksum/hash')}
      onChange={(value) => updateDescriptor({ hash: value || undefined })}
    />
  )
}

function Bytes() {
  const bytes = useStore((state) => state.descriptor.bytes)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Bytes"
      value={bytes || ''}
      onFocus={() => updateHelp('resource/checksum/bytes')}
      onChange={(value) => updateDescriptor({ bytes: parseInt(value) || undefined })}
    />
  )
}

function Fields() {
  const type = useStore((state) => state.descriptor.type)
  const fields = useStore((state) => state.descriptor.fields)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  // Until standards@2 we use a safer check
  if (['file', 'text', 'json'].includes(type)) return null
  return (
    <InputField
      label="Fields"
      value={fields || ''}
      onFocus={() => updateHelp('resource/checksum/fields')}
      onChange={(value) => updateDescriptor({ fields: parseInt(value) || undefined })}
    />
  )
}

function Rows() {
  const type = useStore((state) => state.descriptor.type)
  const rows = useStore((state) => state.descriptor.rows)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  // Until standards@2 we use a safer check
  if (['file', 'text', 'json'].includes(type)) return null
  return (
    <InputField
      label="Rows"
      value={rows || ''}
      onFocus={() => updateHelp('resource/checksum/rows')}
      onChange={(value) => updateDescriptor({ fields: parseInt(value) || undefined })}
    />
  )
}
