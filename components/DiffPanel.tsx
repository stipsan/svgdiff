import { styled } from 'linaria/react'
import React, { useEffect, useState } from 'react'

const Wrapper = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const Preview = styled.div`
  svg {
    min-width: 128px;
  }
`

const TwoUpWrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
`
type TwoUpProps = {
  previous: string
  current: string
}
const TwoUp: React.FunctionComponent<TwoUpProps> = props => {
  const { previous, current } = props

  return (
    <TwoUpWrapper>
      <img
        src={previous}
        title="original"
        onLoad={event =>
          console.log(
            'previous',
            event.target,
            event.currentTarget.naturalWidth,
            event.currentTarget.naturalHeight
          )
        }
      />
      <img
        src={current}
        title="modified"
        onLoad={event =>
          console.log(
            'current',
            event.target,
            event.currentTarget.naturalWidth,
            event.currentTarget.naturalHeight
          )
        }
      />
    </TwoUpWrapper>
  )
}

type DiffPanelProps = {
  previous: string
  current: string
}

const useBase64 = (svgText: string) => {
  const [value, setValue] = useState('')
  useEffect(() => {
    setValue(`data:image/svg+xml;base64,${btoa(svgText)}`)
  }, [svgText])

  return value
}

const DiffPanel: React.FunctionComponent<DiffPanelProps> = props => {
  const { previous, current } = props

  const previousUri = useBase64(previous)
  const currentUri = useBase64(current)

  const [mode, setMode] = useState<'two-up' | 'difference'>('two-up')

  return (
    <Wrapper>
      <div>
        {mode}
        set mode <button onClick={() => setMode('difference')} />
        set mode <button onClick={() => setMode('two-up')} />
      </div>
      {mode === 'two-up' && (
        <TwoUp previous={previousUri} current={currentUri} />
      )}
    </Wrapper>
  )
}

export default DiffPanel
