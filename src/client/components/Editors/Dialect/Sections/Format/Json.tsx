import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import InputField from '../../../../Parts/Fields/Input'
import EditorSection from '../../../Base/Section'
import * as settings from '../../../../../settings'
import { useStore, selectors, select } from '../../store'
import YesNoField from '../../../../Parts/Fields/YesNo'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Json" onHeadingClick={() => updateHelp('dialect/format')}>
      <Columns spacing={3}>
        <Box>
          <Keys />
          <Property />
        </Box>
        <Box>
          <Keyed />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Keys() {
  const keys = useStore(select(selectors.json, (json) => json.keys || ''))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateJson = useStore((state) => state.updateJson)
  return (
    <InputField
      label="Keys"
      value={keys}
      onFocus={() => updateHelp('dialect/format/keys')}
      onChange={(value) => updateJson({ keys: value ? value.split(',') : undefined })}
    />
  )
}

function Keyed() {
  const keyed = useStore(select(selectors.json, (json) => json.keyed))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateJson = useStore((state) => state.updateJson)
  return (
    <YesNoField
      label="Keyed"
      value={keyed || settings.DEFAULT_KEYED}
      onFocus={() => updateHelp('dialect/format/keyed')}
      onChange={(keyed) => updateJson({ keyed })}
    />
  )
}

function Property() {
  const property = useStore(select(selectors.json, (json) => json.property || ''))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateJson = useStore((state) => state.updateJson)
  return (
    <InputField
      label="Property"
      value={property}
      onFocus={() => updateHelp('dialect/format/property')}
      onChange={(value) => updateJson({ property: value || undefined })}
    />
  )
}
