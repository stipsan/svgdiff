import { styled } from 'linaria/react'
import React, { useState } from 'react'
import DiffPanel from '../components/DiffPanel'
import EditorPanel from '../components/EditorPanel'
import { defaultSvg } from '../data'

const Layout = styled.div`
  display: flex;
  height: 100vh;
`

const Index: React.FunctionComponent = () => {
  const [previous, setPrevious] = useState(defaultSvg)
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
