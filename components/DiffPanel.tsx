import { styled } from 'linaria/react'
import React, { useEffect, useState } from 'react'

const Wrapper = styled.section`
  display: flex;
  flex: 1;
`

const Preview = styled.div`
  svg {
    min-width: 128px;
  }
`

type DiffPanelProps = {
  previous: string
  current: string
}

const DiffPanel: React.FunctionComponent<DiffPanelProps> = props => {
  const { previous, current } = props
  const [test, setTest] = useState('')

  useEffect(() => {
    setTest(btoa(previous))
  }, [previous])

  return (
    <Wrapper>
      <img
        src={`data:image/svg+xml;base64,${test}`}
        onLoad={event =>
          console.log(
            event.target,
            event.currentTarget.naturalWidth,
            event.currentTarget.naturalHeight
          )
        }
      />
      <Preview dangerouslySetInnerHTML={{ __html: previous }} />
      <Preview dangerouslySetInnerHTML={{ __html: current }} />
    </Wrapper>
  )
}

export default DiffPanel
