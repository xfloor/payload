import type { TextFieldServerComponent } from 'payload'

// import { TextField } from '@payloadcms/ui'
// import { createClientField } from '@payloadcms/ui/shared'
import type React from 'react'

export const CustomTextFieldServer: TextFieldServerComponent = (props) => {
  const { field } = props

  // const clientField = createClientField(field)

  // return <TextField field={clientField} />

  return 'This is a server component for the text field.'
}
