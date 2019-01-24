import React from 'react'

const Upload: React.FunctionComponent = () => {
  return (
    <input
      type="file"
      accept="image/*"
      onChange={event => {
        console.log(event.target.files)
      }}
    />
  )
}

export default Upload
