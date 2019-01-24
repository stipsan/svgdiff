import { styled } from 'linaria/react'
import Link from 'next/link'
import React from 'react'
import EditSvg from '../components/EditSvg'
import Layout from '../components/Layout'

const Title = styled.h1`
  font-weight: bold;
`

const index: React.FunctionComponent = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Title>Hello Next.js 👋</Title>
      <EditSvg />
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </Layout>
  )
}

export default index
