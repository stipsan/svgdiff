import React from 'react'

type UploadProps = {
  onUpload: (result: string) => void
}

const Upload: React.FunctionComponent<UploadProps> = ({ onUpload }) => {
  return (
    <input
      type="file"
      accept=".svg"
      onChange={event => {
        const file = event.target.files[0]

        const reader = new FileReader()
        reader.onload = () => {
          onUpload(reader.result as string)
        }
        reader.readAsText(file)
      }}
    />
  )
}

export default Upload
