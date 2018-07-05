import { Fragment } from 'react'
import Head from 'next/head'

export default ({ children }) => (
  <Fragment>
    <Head>
      <title>Coffee - bark or brew?</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link rel='apple-touch-icon' sizes='180x180' href='/static/apple-touch-icon.png' />
      <link rel='icon' type='image/png' sizes='32x32' href='/static/favicon-32x32.png' />
      <link rel='icon' type='image/png' sizes='16x16' href='/static/favicon-16x16.png' />
      <link rel='manifest' href='/static/site.webmanifest' />
      <link rel='mask-icon' href='/static/safari-pinned-tab.svg' color='#33b6db' />
      <meta name='msapplication-TileColor' content='#ffc40d' />
      <meta name='theme-color' content='#ffffff' />
      <meta name='description' content='Rate todays coffee' />
      <noscript>Your browser does not support JavaScript!</noscript>
    </Head>
    <div className='layout'>
      { children }
    </div>
    <style jsx>
      {`
        .layout {
          text-align: center;
          padding: 20px;
          font-family: 'Courier New', Courier, monospace;
        }
      `}
    </style>
  </Fragment>
)
