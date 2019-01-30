import { styled } from 'linaria/react'
import React, { useState } from 'react'
import DiffPanel from '../components/DiffPanel'
import EditorPanel from '../components/EditorPanel'

const Layout = styled.div`
  display: flex;
  height: 100vh;
  /* @TODO show a warning instead of forcing the min width */
  min-width: 1440px;
`

const Index: React.FunctionComponent = () => {
  const [previous, setPrevious] = useState('')
  const [current, setCurrent] = useState('')

  return (
    <Layout>
      <EditorPanel
        previous={previous}
        current={current}
        setPrevious={setPrevious}
        setCurrent={setCurrent}
      />
      <DiffPanel previous={previous} current={current} />
    </Layout>
  )
}

export default Index
