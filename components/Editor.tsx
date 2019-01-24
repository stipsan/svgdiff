import { styled } from 'linaria/react'
import dynamic from 'next/dynamic'
import React from 'react'
import { AceEditorProps } from 'react-ace'
import Upload from './Upload'

// Uglyness just to work around react-ace not working in SSR, and not being able to use React.lazy for the same reason
const AceEditor = dynamic<AceEditorProps>(
  // @ts-ignore
  async () => {
    const AceEditor = await import('react-ace')
    await import('brace/mode/xml')
    return AceEditor
  },
  { ssr: false }
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 50%;
`

const EditorContainer = styled.div`
  flex: 1;
`

type EditorProps = {
  value: string
  setValue: (value: string) => void
}

const Editor: React.FunctionComponent<EditorProps> = props => {
  const { value, setValue } = props

  return (
    <Wrapper>
      <Upload onUpload={setValue} />
      <textarea
        value={value}
        onChange={event => setValue(event.target.value)}
      />
      <EditorContainer>
        <AceEditor
          mode="xml"
          theme="textmate"
          //name="blah2"
          //onLoad={this.onLoad}
          onChange={(...args) => {
            console.log('ace on change', ...args)
          }}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={value}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2
          }}
        />
      </EditorContainer>

      <button>Paste</button>
      <button>Edit</button>
    </Wrapper>
  )
}

export default Editor
