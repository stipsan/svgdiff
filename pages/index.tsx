import { styled } from 'linaria/react'
// @ts-ignore
import React, { useState, useDeferredValue } from 'react'
import DiffPanel from '../components/DiffPanel'
import EditorPanel from '../components/EditorPanel'

const Layout = styled.div`
  display: flex;
  height: 100vh;
  /* @TODO show a warning instead of forcing the min width */
  min-width: 990px;
`

const Index: React.FunctionComponent = () => {
  const [previous, setPrevious] = useState('')
  const [current, setCurrent] = useState('')

  const deferredPrevious = useDeferredValue(previous, {
    timeoutMs: 5000
  })
  const deferredCurrent = useDeferredValue(current, {
    timeoutMs: 5000
  })

  return (
    <Layout>
      <EditorPanel
        previous={previous}
        current={current}
        setPrevious={setPrevious}
        setCurrent={setCurrent}
      />
      <DiffPanel previous={deferredPrevious} current={deferredCurrent} />
    </Layout>
  )
}

export default Index
