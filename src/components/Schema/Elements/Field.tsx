import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Library/Columns'
import InputField from '../../Library/InputField'
import YesNoField from '../../Library/YesNoField'
import SelectField from '../../Library/SelectField'
import ValuesField from '../../Library/ValuesField'
import MultilineField from '../../Library/MultilineField'
import DescriptorField from '../../Library/DescriptorField'
import * as settings from '../../../settings'
import { useStore } from '../store'

export default function Field() {
  const elementIndex = useStore((state) => state.elementIndex) as number
  const updateField = useStore((state) => state.updateField)
  const field = useStore((state) => state.descriptor.fields[elementIndex])
  const FIELD = (settings.FIELDS as any)[field.type]

  // Components

  const Field = () => (
    <Columns spacing={3}>
      <Box>
        <Name />
        <Columns spacing={1}>
          <Type />
          <Format />
        </Columns>
        <Title />
        <Description />
      </Box>
      <Box>
        <MissingValues />
        <RdfType />
        <Extras />
      </Box>
    </Columns>
  )

  const Name = () => (
    <InputField
      label="Name"
      value={field.name}
      handleChange={(name) => updateField({ name })}
    />
  )

  const Type = () => (
    <SelectField
      label="Type"
      value={field.type}
      options={Object.keys(settings.FIELDS)}
      handleChange={(type) => updateField({ type })}
    />
  )

  const Format = () => {
    const isFree = FIELD.formats.includes('*')
    if (isFree) return <FreeFormat />
    return <SelectFormat />
  }

  const FreeFormat = () => (
    <InputField
      label="Format"
      value={field.format}
      handleChange={(format) => updateField({ format })}
    />
  )

  const SelectFormat = () => (
    <SelectField
      label="Format"
      value={field.format}
      options={FIELD.formats}
      handleChange={(format) => updateField({ format })}
    />
  )

  const Title = () => (
    <InputField
      label="Title"
      value={field.title || ''}
      handleChange={(title) => updateField({ title })}
    />
  )

  const Description = () => (
    <MultilineField
      label="Description"
      value={field.description || ''}
      handleChange={(description) => updateField({ description })}
    />
  )

  const MissingValues = () => (
    <ValuesField
      type="missing"
      values={field.missingValues || []}
      options={settings.MISSING_VALUES}
      handleChange={(missingValues) => updateField({ missingValues })}
    />
  )

  const RdfType = () => (
    <InputField
      label="RDF Type"
      value={field.rdfType || ''}
      handleChange={(rdfType) => updateField({ rdfType })}
    />
  )

  const Extras = () => {
    switch (field.type) {
      case 'array':
        return <ArrayExtras />
      case 'boolean':
        return <BooleanExtras />
      case 'integer':
        return <IntegerExtras />
      case 'number':
        return <NumberExtras />
      default:
        return null
    }
  }

  const ArrayExtras = () => (
    <React.Fragment>
      <ArrayItem />
    </React.Fragment>
  )

  const BooleanExtras = () => (
    <React.Fragment>
      <TrueValues />
      <FalseValues />
    </React.Fragment>
  )

  const IntegerExtras = () => (
    <React.Fragment>
      <BareNumber />
      <GroupChar />
    </React.Fragment>
  )

  const NumberExtras = () => (
    <React.Fragment>
      <Columns spacing={1}>
        <BareNumber />
        <GroupChar />
      </Columns>
      <Columns spacing={1}>
        <FloatNumber />
        <DecimalChar />
      </Columns>
    </React.Fragment>
  )

  const ArrayItem = () => (
    <DescriptorField
      type="yaml"
      label="Array Item"
      value={field.arrayItem}
      handleChange={(arrayItem) => updateField({ arrayItem })}
    />
  )

  // TODO: add values enabled by default?
  const TrueValues = () => (
    <ValuesField
      type="true"
      values={field.trueValues || []}
      options={settings.TRUE_VALUES}
      handleChange={(trueValues) => updateField({ trueValues })}
    />
  )

  // TODO: add values enabled by default?
  const FalseValues = () => (
    <ValuesField
      type="false"
      values={field.falseValues || []}
      options={settings.FALSE_VALUES}
      handleChange={(falseValues) => updateField({ falseValues })}
    />
  )

  const BareNumber = () => (
    <YesNoField
      label="Bare Number"
      value={field.bareNumber || settings.DEFAULT_BARE_NUMBER}
      handleChange={(bareNumber) => updateField({ bareNumber })}
    />
  )

  const FloatNumber = () => (
    <YesNoField
      label="Float Number"
      value={field.floatNumber || false}
      handleChange={(floatNumber) => updateField({ floatNumber })}
    />
  )

  const DecimalChar = () => (
    <InputField
      label="Decimal Char"
      value={field.decimalChar || settings.DEFAULT_DECIMAL_CHAR}
      handleChange={(decimalChar) => updateField({ decimalChar })}
    />
  )

  const GroupChar = () => (
    <InputField
      label="Group Char"
      value={field.groupChar || settings.DEFAULT_GROUP_CHAR}
      handleChange={(groupChar) => updateField({ groupChar })}
    />
  )

  return <Field />
}