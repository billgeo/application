import * as React from 'react'
import noop from 'lodash/noop'
import TextField from '@mui/material/TextField'

// TODO: rework all the fields wrappign props (see buttons)
// TODO: fix it loosing focus
// TODO: handle different value types properly (string/number/etc)

interface InputFieldProps {
  type?: string
  label: string
  name?: string
  value: any
  size?: 'small' | 'medium'
  disabled?: boolean
  inputProps?: object
  error?: boolean
  helperText?: string
  required?: boolean
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  onKeyDown?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export default function InputField(props: InputFieldProps) {
  const onChange = props.onChange || noop
  const onKeyDown = props.onKeyDown || noop
  const onFocus = props.onFocus || noop
  const onBlur = props.onBlur || noop
  return (
    <TextField
      fullWidth
      name={props.name || props.label}
      type={props.type}
      margin="normal"
      label={props.label}
      value={props.value}
      size={props.size || 'small'}
      disabled={props.disabled}
      inputProps={props.inputProps}
      onChange={(ev) => onChange(ev.target.value)}
      error={props.error}
      required={props.required}
      helperText={props.helperText}
      onKeyDown={onKeyDown}
      placeholder={props.placeholder}
      onFocus={onFocus}
      onBlur={onBlur}
      autoFocus={props.autoFocus}
    />
  )
}
