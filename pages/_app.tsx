import React from 'react'
import App, { Container } from 'next/app'
import { styled } from 'linaria/react'

const Layout = styled.main`
  font-family: system-ui;
`

export default class extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Container>
    )
  }
}
