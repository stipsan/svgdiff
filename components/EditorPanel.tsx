import { styled } from 'linaria/react'
import React from 'react'
import Editor from './Editor'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
  width: 33%;
`

type EditorPanelProps = {
  previous: string
  current: string
  setPrevious: (payload: string) => void
  setCurrent: (payload: string) => void
}

const EditorPanel: React.FunctionComponent<EditorPanelProps> = props => {
  const { previous, current, setPrevious, setCurrent } = props

  return (
    <Wrapper>
      <Editor value={previous} setValue={setPrevious} />
      <Editor value={current} setValue={setCurrent} />
    </Wrapper>
  )
}

export default EditorPanel
