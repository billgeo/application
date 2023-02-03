import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Actions from './Actions'
import Content from './Content'
import Dialog from './Dialog'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const listFiles = useStore((state) => state.listFiles)
  React.useEffect(() => {
    listFiles().catch(console.error)
  }, [])
  return (
    <React.Fragment>
      <Dialog />
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height }}>
          <Content />
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Actions />
        </Box>
      </Box>
    </React.Fragment>
  )
}