import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { IHelpItem, IFieldItem } from '../../../interfaces'
import { ChartProps } from './Chart'
import { Registry } from '../../../libraries/vega-presets/registry'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'chart')!

interface State {
  table?: string
  preset?: string
  options: { [key: string]: any }
  fields: IFieldItem[]
  onChange: (chart: object) => void
  helpItem: IHelpItem
  updateState: (patch: Partial<State>) => void
  updateHelp: (path: string) => void
}

export function makeStore(props: ChartProps) {
  return createStore<State>((set, get) => ({
    options: {},
    table: props.table,
    preset: props.preset,
    fields: props.fields || [],
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateState: (patch) => {
      set({ ...patch })
      const { table, preset, options, onChange } = get()
      if (!table) return
      if (!preset) return
      // @ts-ignore
      const Preset = Registry.getPreset(preset)
      if (!Preset) return
      for (const option of Preset.target.options) if (!(option.name in options)) return
      // @ts-ignore
      const presetObject = new Preset({ ...options, data: { url: table } })
      const chart = presetObject.toVegaLite()
      onChange(chart)
    },
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },
  }))
}

export const select = createSelector
export const selectors = {
  tables: (state: State) => {
    const tables: { [name: string]: string } = {}
    for (const field of state.fields) tables[field.tableName] = field.tablePath
    return tables
  },
  stringFields: (state: State) => {
    return state.fields
      .filter((item) => item.tablePath === state.table && item.type === 'string')
      .map((item) => item.name)
  },
  numberFields: (state: State) => {
    return state.fields
      .filter(
        (item) =>
          item.tablePath === state.table && ['number', 'integer'].includes(item.type)
      )
      .map((item) => item.name)
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
