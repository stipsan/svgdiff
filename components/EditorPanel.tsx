import { styled } from 'linaria/react'
import React from 'react'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 33%;
`

const Editor = styled.div``

type EditorPanelProps = {
  setPrevious: (payload: string) => void
  setCurrent: (payload: string) => void
}

const EditorPanel: React.FunctionComponent<EditorPanelProps> = props => {
  const { setPrevious, setCurrent } = props

  return (
    <Wrapper>
      <Editor>
        <textarea />
      </Editor>
      <Editor>
        <textarea />
      </Editor>
    </Wrapper>
  )
}

export default EditorPanel
