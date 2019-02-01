import React from 'react'
import { button } from '../lib/design'

type UploadProps = {
  id: string
  onUpload: (result: string) => void
}

const Upload: React.FunctionComponent<UploadProps> = ({ id, onUpload }) => (
  <>
    <input
      id={id}
      style={{ display: 'none' }}
      type="file"
      accept=".svg"
      onChange={event => {
        const file = event.target.files[0]

        if (!file) {
          return
        }

        const reader = new FileReader()
        reader.onload = () => {
          onUpload(reader.result as string)
        }
        reader.readAsText(file)
      }}
    />
    <label className={button} htmlFor={id} tabIndex={0}>
      Upload
    </label>
  </>
)

export default Upload
