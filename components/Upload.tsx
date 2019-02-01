import { css } from 'linaria'
import React from 'react'

const Input = css`
  display: none;
`

const Label = css`
  background-color: hsla(0, 0%, 0%, 0.1);
  border-radius: 5px;
  color: hsla(0, 0%, 100%, 1);
  padding: 0.5em 0.75em;
  text-align: center;
  white-space: nowrap;
  user-select: none;

  &:hover {
    background-color: #eee;
    border-color: transparent;
    color: #363636;
  }

  &:active {
    background-color: #e8e8e8;
    border-color: transparent;
    color: #363636;
  }
`

type UploadProps = {
  id: string
  onUpload: (result: string) => void
}

const Upload: React.FunctionComponent<UploadProps> = ({ id, onUpload }) => (
  <>
    <input
      className={Input}
      id={id}
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
    <label className={Label} htmlFor={id}>
      Upload
    </label>
  </>
)

export default Upload
