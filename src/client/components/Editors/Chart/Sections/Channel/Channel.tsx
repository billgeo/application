import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import EditorItem from '../../../Base/Item'
import EditorList from '../../../Base/List'
import EditorListItem from '../../../Base/ListItem'
import EditorSearch from '../../../Base/Search'
import InputField from '../../../../Parts/Fields/Input'
import SelectField from '../../../../Parts/Fields/Select'
import { useStore, selectors, select } from '../../store'
import * as settings from '../../settings'
import Bin from './Bin'
import Axis from './Axis'
import Sorting from './Sorting'

const PROPERTIES: { [key: string]: any } = {
  x: [Bin, Axis, Sorting],
  y: [Bin, Axis, Sorting],
}

export default function Channel() {
  const type = useStore((state) => state.channelStates[state.layerIndex]?.type)
  return type === undefined ? <ChannelList /> : <ChannelItem />
}

function ChannelList() {
  const isGrid = useStore((state) => state.channelStates[state.layerIndex]?.isGrid)
  const query = useStore((state) => state.channelStates[state.layerIndex]?.query)
  const channelItems = useStore(selectors.channelItems)
  const updateChannelState = useStore((state) => state.updateChannelState)
  const addChannel = useStore((state) => state.addChannel)
  const removeChannel = useStore((state) => state.removeChannel)
  return (
    <EditorList
      kind="channel"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addChannel()}
      onGridClick={() => updateChannelState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateChannelState({ query })}
        />
      }
    >
      {channelItems.map(({ type }) => (
        <EditorListItem
          key={type}
          kind="channel"
          type="channel"
          name={type}
          isGrid={isGrid}
          onClick={() => updateChannelState({ type })}
          onRemoveClick={() => removeChannel(type)}
        />
      ))}
    </EditorList>
  )
}

function ChannelItem() {
  const type = useStore((state) => state.channelStates[state.layerIndex]?.type!)
  const isExtras = useStore((state) => state.channelStates[state.layerIndex]?.isExtras)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <EditorItem
      kind="channel"
      name={type}
      isExtras={isExtras}
      onBackClick={() => updateChannelState({ type: undefined, isExtras: false })}
    >
      <Columns spacing={3}>
        <Box>
          <Type />
          <Field />
          <ChannelTitle />
          <Stack />
        </Box>
        <Box>
          <Aggregate />
          <Value />
          <FieldType />
          <TimeUnit />
        </Box>
      </Columns>
      {PROPERTIES[type] &&
        PROPERTIES[type].map((Item: any, index: number) => {
          return <Item key={index} />
        })}
    </EditorItem>
  )
}

function Type() {
  const type = useStore((state) => state.channelStates[state.layerIndex]?.type!)
  const updateChannelType = useStore((state) => state.updateChannelType)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <SelectField
      label="Type"
      value={type || ''}
      options={settings.CHANNEL_TYPES}
      onFocus={() => updateHelp('channels/type')}
      onChange={(value) => (value ? updateChannelType(value) : undefined)}
    />
  )
}

function Field() {
  const field = useStore(select(selectors.channel, (channel) => channel.field))
  const updateChannel = useStore((state) => state.updateChannel)
  const fieldNames = useStore(selectors.fieldNames)
  const customFields = useStore((state) => state.customFields)
  const updateHelp = useStore((state) => state.updateHelp)
  const allFields = fieldNames.concat(customFields)
  return (
    <SelectField
      label="Field"
      value={field || ''}
      options={allFields}
      onFocus={() => updateHelp('channels/field')}
      onChange={(value) => updateChannel({ field: value })}
    />
  )
}

function ChannelTitle() {
  const title = useStore(selectors.channelActiveInputValue('title'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => {
        updateHelp('channels/title')
        updateChannelState({ activeInput: 'title' })
      }}
      onChange={(value) => updateChannel({ title: value || undefined })}
    />
  )
}

function Stack() {
  const stack = useStore(selectors.channelActiveInputValue('stack'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <InputField
      label="Stack"
      value={stack || ''}
      onFocus={() => {
        updateHelp('channels/stack')
        updateChannelState({ activeInput: 'stack' })
      }}
      onChange={(value) => updateChannel({ stack: value || undefined })}
    />
  )
}

function Aggregate() {
  const aggregate = useStore(selectors.channelAggregate)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <SelectField
      label="Aggregate"
      value={aggregate || ''}
      options={settings.CHANNEL_AGGREGATES}
      onFocus={() => updateHelp('channels/aggregate')}
      onChange={(value) => updateChannel({ aggregate: value })}
    />
  )
}

function Value() {
  const value = useStore(selectors.channelValue)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <InputField
      label="Value"
      value={value || ''}
      onFocus={() => updateHelp('channels/value')}
      onChange={(value) => updateChannel({ value: value ? parseInt(value) : undefined })}
    />
  )
}

function FieldType() {
  const type = useStore(selectors.channelActiveInputValue('type'))
  const updateChannel = useStore((state) => state.updateChannel)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <SelectField
      label="Field Type"
      value={type || ''}
      options={settings.FIELD_TYPES}
      onFocus={() => updateHelp('channels/fieldType')}
      onChange={(value) => {
        if (!value) value = undefined
        updateChannel({ customFieldType: value })
        console.log({ customFieldType: value })
      }}
    />
  )
}

function TimeUnit() {
  const timeUnit = useStore(selectors.channelActiveInputValue('timeUnit'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <SelectField
      label="TimeUnit"
      value={timeUnit ?? ''}
      options={settings.TIME_UNITS}
      onFocus={() => {
        updateHelp('channels/timeUnit')
        updateChannelState({ activeInput: 'timeUnit' })
      }}
      onChange={(value) => {
        updateChannel({ timeUnit: value })
      }}
    />
  )
}
