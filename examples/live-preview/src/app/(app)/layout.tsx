/* eslint-disable no-restricted-exports */
import React from 'react'

import { Header } from './_components/Header'
import './app.scss'

export const metadata = {
  description: 'Generated by create next app',
  title: 'Create Next App',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
