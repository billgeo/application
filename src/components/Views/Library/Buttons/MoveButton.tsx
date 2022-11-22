import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import FileNavigator from '../FileNavigator'
import Columns from '../Columns'
import { DialogContent } from '@mui/material'

interface MoveButtonProps {
  label: string
  disabled?: boolean
  moveFile: (destination: string) => void
  createDirectory: (directoryname: string) => void
  listFolders: () => Promise<void>
}

export default function MoveButton(props: MoveButtonProps) {
  const [open, setOpen] = React.useState(false)
  const [paths, setPaths] = React.useState([])
  const [destination, setDestination] = React.useState<string | null>(null)
  if (!props.listFolders()) return null
  React.useEffect(() => {
    console.log('props', props)
    console.log('paths', paths)
  }, [])
  const onMoveClick = () => {
    if (!open) {
      props.listFolders()
      setPaths([])
    }
    setOpen(!open)
  }
  const onDialogBoxCancel = () => {
    setOpen(false)
  }
  const onCancelMove = () => {
    setDestination(null)
    setOpen(false)
  }
  const onFolderSelect = (destinationFolder: string | null) => {
    setDestination(destinationFolder)
  }
  const onCreateDirectory = (directoryname: string) => {
    props.createDirectory(directoryname)
  }
  return (
    <React.Fragment>
      <Button disabled={props.disabled} color="info" title="Move" onClick={onMoveClick}>
        Move
      </Button>
      <Dialog fullWidth maxWidth="sm" onClose={onDialogBoxCancel} open={open}>
        <DialogTitle>
          Move To
          <IconButton
            aria-label="close"
            onClick={onDialogBoxCancel}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            borderStyle: 'dotted',
            borderWidth: 1,
            borderRadius: 1,
            marginLeft: 3,
            marginRight: 3,
          }}
        >
          <FileNavigator
            onFolderSelect={onFolderSelect}
            onCreateDirectory={onCreateDirectory}
          />
        </DialogContent>
        <Box sx={{ paddingX: 3, paddingY: 1 }}>
          <Columns spacing={2}>
            <Button
              fullWidth
              sx={{ my: 0.5 }}
              variant="contained"
              size="small"
              onClick={() => {
                if (destination === null) return
                props.moveFile(destination)
                setOpen(false)
              }}
              disabled={destination === null}
              aria-label="move selected right"
              color="secondary"
            >
              Move
            </Button>
            <Button
              fullWidth
              sx={{ my: 0.5 }}
              variant="contained"
              size="small"
              onClick={onCancelMove}
              // disabled={leftChecked.length === 0}
              aria-label="move selected right"
              color="warning"
            >
              Cancel
            </Button>
          </Columns>
        </Box>
      </Dialog>
    </React.Fragment>
  )
}