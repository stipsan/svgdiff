import App from 'next/app'
import Head from 'next/head'

import 'tailwindcss/tailwind.css'

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
        <main>
          <Component {...pageProps} />
        </main>
      </>
    )
  }
}
