import * as React from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/AddBox'
import FolderIcon from '@mui/icons-material/Folder'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DropdownButton from '../../../Parts/Buttons/DropdownButton'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import * as settings from '../../../../settings'
import { useStore, selectors } from '../store'

export default function CreateButton() {
  return (
    <DropdownButton
      label="Create"
      variant="text"
      icon={<AddIcon fontSize="small" sx={{ mr: 1 }} />}
    >
      <UploadButton />
      <FolderButton />
      <PackageButton />
    </DropdownButton>
  )
}

function UploadButton() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  return (
    <React.Fragment>
      <Button variant="text" color="info" component="label">
        <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} />
        Upload File
        <input
          type="file"
          hidden
          multiple
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
            ev.target.files ? uploadFiles(ev.target.files) : null
          }
        />
      </Button>
    </React.Fragment>
  )
}

function FolderButton() {
  const setDialog = useStore((state) => state.setDialog)
  return (
    <DefaultButton
      variant="text"
      color="info"
      label="Create Folder"
      icon={<CreateNewFolderIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => setDialog('name/create')}
    />
  )
}

function PackageButton() {
  const filePaths = useStore(selectors.filePaths)
  const createPackage = useStore((state) => state.createPackage)
  return (
    <DefaultButton
      disabled={filePaths.includes(settings.PACKAGE_PATH)}
      variant="text"
      color="info"
      label="Create Package"
      icon={<FolderIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={createPackage}
    />
  )
}