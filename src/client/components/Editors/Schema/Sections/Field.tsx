import * as React from 'react'
import partition from 'lodash/partition'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Grids/Columns'
import EditorItem from '../../Base/Item'
import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import EditorSearch from '../../Base/Search'
import InputField from '../../../Parts/Fields/Input'
import YesNoField from '../../../Parts/Fields/YesNo'
import SelectField from '../../../Parts/Fields/Select'
import MultilineField from '../../../Parts/Fields/Multiline'
import DescriptorField from '../../../Parts/Fields/Descriptor'
import * as settings from '../../../../settings'
import { useStore, selectors, select } from '../store'
import DatePickerField from '../../../Parts/Fields/DatePicker'
import DateTimePickerField from '../../../Parts/Fields/DateTimePicker'
import TimePickerField from '../../../Parts/Fields/TimePicker'
import validator from 'validator'
import dayjs from 'dayjs'

export default function Field() {
  const index = useStore((state) => state.fieldState.index)
  return index === undefined ? <FieldList /> : <FieldItem />
}

function FieldList() {
  const isGrid = useStore((state) => state.fieldState.isGrid)
  const query = useStore((state) => state.fieldState.query)
  const fieldItems = useStore(selectors.fieldItems)
  const updateFieldState = useStore((state) => state.updateFieldState)
  const addField = useStore((state) => state.addField)
  const removeField = useStore((state) => state.removeField)
  return (
    <EditorList
      kind="field"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addField()}
      onGridClick={() => updateFieldState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateFieldState({ query })}
        />
      }
    >
      {fieldItems.map(({ index, field }) => (
        <EditorListItem
          key={index}
          kind="field"
          name={field.title || field.name}
          type={field.type}
          isGrid={isGrid}
          onClick={() => updateFieldState({ index })}
          onRemoveClick={() => removeField(index)}
        />
      ))}
    </EditorList>
  )
}

function FieldItem() {
  const name = useStore(select(selectors.field, (field) => field.name))
  const isExtras = useStore((state) => state.fieldState.isExtras)
  const updateFieldState = useStore((state) => state.updateFieldState)
  return (
    <EditorItem
      kind="field"
      name={name}
      isExtras={isExtras}
      extrasName="constraints"
      onExtrasClick={() => updateFieldState({ isExtras: !isExtras })}
      onBackClick={() => updateFieldState({ index: undefined, isExtras: false })}
    >
      {isExtras ? <FieldItemExtras /> : <FieldItemMain />}
    </EditorItem>
  )
}

function FieldItemMain() {
  return (
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
        <TypeSpecific />
      </Box>
    </Columns>
  )
}

function Name() {
  const name = useStore(select(selectors.field, (field) => field.name))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateField = useStore((state) => state.updateField)
  return (
    <InputField
      label="Name"
      value={name}
      onFocus={() => updateHelp('schema/field/name')}
      onChange={(value) => updateField({ name: value || undefined })}
    />
  )
}

function Type() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const type = useStore(select(selectors.field, (field) => field.type))
  return (
    <SelectField
      label="Type"
      value={type}
      options={Object.keys(settings.FIELDS)}
      onFocus={() => updateHelp('schema/field/type')}
      onChange={(value) => updateField({ type: value })}
    />
  )
}

function Format() {
  const updateField = useStore((state) => state.updateField)
  const format = useStore(select(selectors.field, (field) => field.format))
  const type = useStore(select(selectors.field, (field) => field.type))
  const updateHelp = useStore((state) => state.updateHelp)
  // TODO: remove any
  const FIELD = (settings.FIELDS as any)[type]
  const isFree = FIELD.formats.includes('*')
  return isFree ? (
    <InputField
      label="Format"
      value={format || ''}
      onFocus={() => updateHelp('schema/field/format')}
      onChange={(value) => updateField({ format: value || undefined })}
    />
  ) : (
    <SelectField
      label="Format"
      value={format || ''}
      options={FIELD.formats}
      onFocus={() => updateHelp('schema/fields/format')}
      onChange={(value) => updateField({ format: value || undefined })}
    />
  )
}

function Title() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const title = useStore(select(selectors.field, (field) => field.title))
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('schema/field/title')}
      onChange={(value) => updateField({ title: value || undefined })}
    />
  )
}

function Description() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const descriptor = useStore(select(selectors.field, (field) => field.description))
  return (
    <MultilineField
      label="Description"
      value={descriptor || ''}
      onFocus={() => updateHelp('schema/field/description')}
      onChange={(value) => updateField({ description: value || undefined })}
    />
  )
}

function MissingValues() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const missingValues = useStore(select(selectors.field, (field) => field.missingValues))
  return (
    <InputField
      label="Missing Values"
      value={(missingValues || []).join(',')}
      onFocus={() => updateHelp('schema/field/missingValues')}
      onChange={(value) =>
        updateField({ missingValues: value ? value.split(',') : undefined })
      }
    />
  )
}

function RdfType() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const rdfType = useStore(select(selectors.field, (field) => field.rdfType))
  return (
    <InputField
      label="RDF Type"
      value={rdfType || ''}
      onFocus={() => updateHelp('schema/field/rdfType')}
      onChange={(value) => updateField({ rdfType: value || undefined })}
    />
  )
}

function TypeSpecific() {
  const type = useStore(select(selectors.field, (field) => field.type))
  switch (type) {
    case 'array':
      return <ArraySpecific />
    case 'boolean':
      return <BooleanSpecific />
    case 'integer':
      return <IntegerSpecific />
    case 'number':
      return <NumberSpecific />
    default:
      return null
  }
}

function ArraySpecific() {
  return (
    <React.Fragment>
      <ArrayItem />
    </React.Fragment>
  )
}

function BooleanSpecific() {
  return (
    <React.Fragment>
      <TrueValues />
      <FalseValues />
    </React.Fragment>
  )
}

function IntegerSpecific() {
  return (
    <React.Fragment>
      <BareNumber />
      <GroupChar />
    </React.Fragment>
  )
}
function NumberSpecific() {
  return (
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
}

function ArrayItem() {
  const updateField = useStore((state) => state.updateField)
  const arrayItem = useStore(select(selectors.field, (field) => field.arrayItem))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <DescriptorField
      type="yaml"
      label="Array Item"
      value={arrayItem}
      onFocus={() => updateHelp('schema/field/arrayItem')}
      onChange={(value) => updateField({ arrayItem: value || undefined })}
    />
  )
}

function TrueValues() {
  const updateField = useStore((state) => state.updateField)
  const trueValues = useStore(select(selectors.field, (field) => field.trueValues))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      label="True Values"
      value={(trueValues || []).join(',')}
      onFocus={() => updateHelp('schema/field/trueValues')}
      onChange={(value) =>
        updateField({ trueValues: value ? value.split(',') : undefined })
      }
    />
  )
}

function FalseValues() {
  const updateField = useStore((state) => state.updateField)
  const falseValues = useStore(select(selectors.field, (field) => field.falseValues))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      label="False Values"
      value={(falseValues || []).join(',')}
      onFocus={() => updateHelp('schema/field/falseValues')}
      onChange={(value) =>
        updateField({ falseValues: value ? value.split(',') : undefined })
      }
    />
  )
}

function BareNumber() {
  const updateField = useStore((state) => state.updateField)
  const bareNumber = useStore(select(selectors.field, (field) => field.bareNumber))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <YesNoField
      label="Bare Number"
      value={bareNumber || settings.DEFAULT_BARE_NUMBER}
      onFocus={() => updateHelp('schema/field/bareNumber')}
      onChange={(value) =>
        updateField({ bareNumber: value === false ? value : undefined })
      }
    />
  )
}

function FloatNumber() {
  const updateField = useStore((state) => state.updateField)
  const floatNumber = useStore(select(selectors.field, (field) => field.floatNumber))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <YesNoField
      label="Float Number"
      value={floatNumber || false}
      onFocus={() => updateHelp('schema/field/floatNumber')}
      onChange={(value) => updateField({ floatNumber: value || undefined })}
    />
  )
}

function DecimalChar() {
  const updateField = useStore((state) => state.updateField)
  const decimalChar = useStore(select(selectors.field, (field) => field.decimalChar))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      label="Decimal Char"
      onFocus={() => updateHelp('schema/field/decimalChar')}
      value={decimalChar || settings.DEFAULT_DECIMAL_CHAR}
      onChange={(value) => updateField({ decimalChar: value || undefined })}
    />
  )
}

function GroupChar() {
  const updateField = useStore((state) => state.updateField)
  const groupChar = useStore(select(selectors.field, (field) => field.groupChar))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      label="Group Char"
      onFocus={() => updateHelp('schema/field/groupChar')}
      value={groupChar || settings.DEFAULT_GROUP_CHAR}
      onChange={(value) => updateField({ groupChar: value || undefined })}
    />
  )
}

function FieldItemExtras() {
  const field = useStore(selectors.field)
  // TODO: remove any
  const FIELD = (settings.FIELDS as any)[field.type]
  const isLeft = (name: string) => !name.startsWith('m')
  const [lefts, rights] = partition(FIELD.constraints, isLeft)
  return (
    <Columns spacing={3}>
      <Box>
        {lefts.map((type: string) => (
          <Constraint key={type} type={type} />
        ))}
      </Box>
      <Box>
        {rights.map((type: string) => (
          <Constraint key={type} type={type} />
        ))}
      </Box>
    </Columns>
  )
}

function Constraint(props: { type: string }) {
  switch (props.type) {
    case 'required':
      return <Required />
    case 'enum':
      return <Enum />
    case 'minLength':
      return <MinLength />
    case 'maxLength':
      return <MaxLength />
    case 'minimum':
      return <Minimum />
    case 'maximum':
      return <Maximum />
    case 'pattern':
      return <Pattern />
    default:
      return null
  }
}

function Required() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <YesNoField
      label="Required"
      onFocus={() => updateHelp('schema/field/required')}
      value={constraints?.required || false}
      onChange={(required) => updateField({ constraints: { ...constraints, required } })}
    />
  )
}

function Minimum() {
  const type = useStore(select(selectors.field, (field) => field.type))
  switch (type) {
    case 'date':
      return <MinimumDate />
    case 'datetime':
      return <MinimumDateTime />
    case 'time':
      return <MinimumTime />
    default:
      return <MinimumNumber />
  }
}

function Maximum() {
  const type = useStore(select(selectors.field, (field) => field.type))
  switch (type) {
    case 'date':
      return <MaximumDate />
    case 'datetime':
      return <MaximumDateTime />
    case 'time':
      return <MaximumTime />
    default:
      return <MaximumNumber />
  }
}

function MinimumDate() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_DATE_FORMAT
  const value = constraints ? dayjs(constraints.minimum, format) : null
  return (
    <DatePickerField
      label="Minimum"
      value={value}
      onFocus={() => updateHelp('schema/field/minimum')}
      onChange={(value) => {
        if (!value) return
        updateField({ constraints: { ...constraints, minimum: value.format(format) } })
      }}
      errorMessage={'Minimum value is not valid'}
    />
  )
}

function MaximumDate() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_DATE_FORMAT
  const value = constraints ? dayjs(constraints.maximum, format) : null
  return (
    <DatePickerField
      label="Maximum"
      value={value}
      onFocus={() => updateHelp('schema/field/maximum')}
      onChange={(value) => {
        if (!value) return
        updateField({ constraints: { ...constraints, maximum: value.format(format) } })
      }}
      errorMessage={'Maximum value is not valid'}
    />
  )
}

function MinimumDateTime() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_DATETIME_FORMAT
  const value = constraints ? dayjs(constraints.minimum, format) : null
  return (
    <DateTimePickerField
      label="Minimum"
      value={value}
      onFocus={() => updateHelp('schema/field/minimum')}
      onChange={(value) => {
        if (!value) return
        updateField({ constraints: { ...constraints, minimum: value.format(format) } })
      }}
      errorMessage={'Minimum value is not valid'}
    />
  )
}

function MaximumDateTime() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_DATETIME_FORMAT
  const value = constraints ? dayjs(constraints.maximum, format) : null
  return (
    <DateTimePickerField
      label="Maximum"
      value={value}
      onFocus={() => updateHelp('schema/field/maximum')}
      onChange={(value) => {
        if (!value) return
        updateField({ constraints: { ...constraints, maximum: value.format(format) } })
      }}
      errorMessage={'Maximum value is not valid'}
    />
  )
}

function MinimumTime() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_TIME_FORMAT
  const value = constraints ? dayjs(constraints.minimum, format) : null
  return (
    <TimePickerField
      label="Minimum"
      value={value}
      onFocus={() => updateHelp('schema/field/minimum')}
      onChange={(value) => {
        if (!value) return
        updateField({
          constraints: {
            ...constraints,
            minimum: value.format(format),
          },
        })
      }}
      errorMessage={'Minimum value is not valid'}
    />
  )
}

function MaximumTime() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_TIME_FORMAT
  const value = constraints ? dayjs(constraints.maximum, format) : null
  return (
    <TimePickerField
      label="Maximum"
      value={value}
      onFocus={() => updateHelp('schema/field/maximum')}
      onChange={(value) => {
        if (!value) return
        updateField({
          constraints: {
            ...constraints,
            maximum: value.format(format),
          },
        })
      }}
      errorMessage={'Maximum value is not valid'}
    />
  )
}

function MinimumNumber() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const [isValid, setIsValid] = React.useState(isValidMinimumNumber())
  function isValidMinimumNumber() {
    if (!constraints) return true
    return constraints.minimum
      ? validator.isNumeric(constraints.minimum.toString())
      : true
  }
  return (
    <InputField
      error={!isValid}
      type="number"
      label="Minimum"
      value={constraints?.minimum || ''}
      onFocus={() => updateHelp('schema/field/minimum')}
      onBlur={() => {
        setIsValid(isValidMinimumNumber())
      }}
      onChange={(value) =>
        updateField({ constraints: { ...constraints, minimum: parseInt(value) } })
      }
      helperText={!isValid ? 'Minimum value is not valid.' : ''}
    />
  )
}

function MaximumNumber() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const [isValid, setIsValid] = React.useState(isValidMaximumNumber())
  function isValidMaximumNumber() {
    if (!constraints) return true
    return constraints.maximum
      ? validator.isNumeric(constraints.maximum.toString())
      : true
  }
  return (
    <InputField
      error={!isValid}
      type="number"
      label="Maximum"
      value={constraints?.maximum || ''}
      onFocus={() => updateHelp('schema/field/maximum')}
      onBlur={() => {
        setIsValid(isValidMaximumNumber())
      }}
      onChange={(value) =>
        updateField({ constraints: { ...constraints, maximum: parseInt(value) } })
      }
      helperText={!isValid ? 'Maximum value is not valid.' : ''}
    />
  )
}

function MinLength() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      type="number"
      label="Min Length"
      value={constraints?.minLength || ''}
      onFocus={() => updateHelp('schema/field/minLength')}
      onChange={(value) =>
        updateField({ constraints: { ...constraints, minLength: parseInt(value) } })
      }
    />
  )
}

function MaxLength() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      type="number"
      label="Max Length"
      value={constraints?.maxLength || ''}
      onFocus={() => updateHelp('schema/field/maxLength')}
      onChange={(value) =>
        updateField({ constraints: { ...constraints, maxLength: parseInt(value) } })
      }
    />
  )
}

function Pattern() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      type="string"
      label="Pattern"
      value={constraints?.pattern || ''}
      onFocus={() => updateHelp('schema/field/pattern')}
      onChange={(pattern) => updateField({ constraints: { ...constraints, pattern } })}
    />
  )
}

function Enum() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      type="string"
      label="Enum"
      value={(constraints?.enum || []).join(',')}
      onFocus={() => updateHelp('schema/field/enum')}
      onChange={(value) => updateField({ constraints: { ...constraints, enum: value } })}
    />
  )
}
