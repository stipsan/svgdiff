import React from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { styled } from 'linaria/react'

const Title = styled.h1`
  font-weight: bold;
`

const index: React.FunctionComponent = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Title>Hello Next.js 👋</Title>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </Layout>
  )
}

export default index
