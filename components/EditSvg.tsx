import React, { useState } from 'react'
import Upload from './Upload'

const EditSvg: React.FunctionComponent = () => {
  const [source, setSource] = useState('')

  return (
    <>
      <Upload
        onUpload={something =>
          console.log('onUpload', something) || setSource(something)
        }
      />
      <img src={source} />
      <button>Paste</button>
      <button>Edit</button>
    </>
  )
}

export default EditSvg
