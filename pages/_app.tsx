import { styled } from 'linaria/react'
import App from 'next/app'
import Head from 'next/head'
import 'normalize.css'

const Layout = styled.main`
  font-family: system-ui;
`

export default class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <title>svgdiff</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    )
  }
}
