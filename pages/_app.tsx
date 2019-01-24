import { styled } from 'linaria/react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import 'normalize.css'
import React from 'react'

const Layout = styled.main`
  font-family: system-ui;
`

export default class extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <title>@TODO</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Container>
    )
  }
}
