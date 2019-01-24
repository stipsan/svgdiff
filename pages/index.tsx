import { styled } from 'linaria/react'
import React, { useState } from 'react'
import DiffPanel from '../components/DiffPanel'
import EditorPanel from '../components/EditorPanel'

const Layout = styled.div`
  display: flex;
  height: 100vh;
`

const Index: React.FunctionComponent = () => {
  const [previous, setPrevious] = useState(false)
  const [current, setCurrent] = useState(false)

  return (
    <Layout>
      <EditorPanel
        setPrevious={payload => setPrevious(payload)}
        setCurrent={payload => setCurrent(payload)}
      />
      <DiffPanel previous={previous} current={current} />
    </Layout>
  )
}

export default Index
