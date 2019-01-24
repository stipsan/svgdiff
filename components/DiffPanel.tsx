import { styled } from 'linaria/react'
import React from 'react'

const Wrapper = styled.section`
  display: flex;
  flex: 1;
`

const Preview = styled.div`
  svg {
    min-width: 32px;
  }
`

type DiffPanelProps = {
  previous: string
  current: string
}

const DiffPanel: React.FunctionComponent<DiffPanelProps> = props => {
  const { previous, current } = props

  return (
    <Wrapper>
      <Preview dangerouslySetInnerHTML={{ __html: previous }} />
    </Wrapper>
  )
}

export default DiffPanel
