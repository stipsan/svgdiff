import useComponentSize from '@rehooks/component-size'
import { styled } from 'linaria/react'
import dynamic from 'next/dynamic'
import React, { useRef } from 'react'
import { AceEditorProps } from 'react-ace'
import Upload from './Upload'

// Uglyness just to work around react-ace not working in SSR, and not being able to use React.lazy for the same reason
const AceEditor = dynamic<AceEditorProps>(
  // @ts-ignore
  async () => {
    const AceEditor = await import('react-ace')
    await import('brace/mode/xml')
    await import('brace/theme/monokai')
    return AceEditor
  },
  { ssr: false }
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 50%;
  border-radius: 8px;
  overflow: hidden;

  &:not(:first-child) {
    margin-top: 20px;
  }
`

const EditorContainer = styled.div`
  flex: 1;
`

type EditorProps = {
  value: string
  setValue: (value: string) => void
}

const Toolbar = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 4px 8px;
  background: hsla(72, 9%, 22%, 1);
  color: white;
`

// Upload or paste/edit

const Editor: React.FunctionComponent<EditorProps> = props => {
  const { value, setValue } = props
  const ref = useRef(null)
  const { width, height } = useComponentSize(ref)

  return (
    <Wrapper>
      <Toolbar>
        <Upload onUpload={setValue} />
        <label>
          <input type="checkbox" defaultChecked /> Update while typing
        </label>
        <button>Prettify</button>
      </Toolbar>
      <EditorContainer ref={ref}>
        <AceEditor
          mode="xml"
          theme="monokai"
          onChange={value => setValue(value)}
          fontSize={14}
          showPrintMargin={false}
          value={value}
          width={`${width}px`}
          height={`${height}px`}
        />
      </EditorContainer>
    </Wrapper>
  )
}

export default Editor
