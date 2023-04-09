import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import { IFieldItem } from '../../../interfaces'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface ChartProps {
  fields?: IFieldItem[]
  onChange?: (chart: object) => void
}

export default function Chart(props: ChartProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
