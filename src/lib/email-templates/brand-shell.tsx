import * as React from 'react'

import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from '@react-email/components'

export const NAVY = '#1C2637'
export const CREAM = '#F6F1E7'
export const INK = '#1C1B18'
export const MUTED = '#6B655B'
export const RULE = '#E0D9CB'

export const SITE_URL = 'https://skingrocer.com.au'
export const SUPPORT_EMAIL = 'hello@skingrocer.com.au'

export const text = { fontSize: '14px', color: MUTED, lineHeight: '1.7', margin: '0 0 20px' }
export const link = { color: NAVY, textDecoration: 'underline' }
export const button = {
  backgroundColor: NAVY,
  color: CREAM,
  fontSize: '13px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  padding: '13px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}
export const code = {
  fontFamily: 'Courier, monospace',
  fontSize: '26px',
  letterSpacing: '0.2em',
  fontWeight: 'bold' as const,
  color: INK,
  margin: '0 0 24px',
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif', margin: 0, padding: '32px 16px' }
const container = { maxWidth: '560px', margin: '0 auto' }
const header = { backgroundColor: NAVY, padding: '28px 24px', textAlign: 'center' as const }
const wordmark = {
  margin: 0,
  fontSize: '18px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
  color: CREAM,
  fontFamily: "Georgia, 'Times New Roman', serif",
}
const brandline = {
  margin: '8px 0 0',
  fontSize: '10px',
  letterSpacing: '0.28em',
  textTransform: 'uppercase' as const,
  color: '#BFAE9B',
}
const bodyPad = { padding: '28px 24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: INK, margin: '0 0 14px' }
const footerText = { fontSize: '12px', color: MUTED, lineHeight: '1.7', margin: '0' }

export function BrandShell({
  preview,
  heading,
  children,
}: {
  preview: string
  heading: string
  children: React.ReactNode
}) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={wordmark}>Skin Grocer</Text>
            <Text style={brandline}>Seoul Sourced. Skin Assured.</Text>
          </Section>
          <Section style={bodyPad}>
            <Heading style={h1}>{heading}</Heading>
            {children}
            <Hr style={{ borderColor: RULE, margin: '28px 0 18px' }} />
            <Text style={footerText}>
              Questions? Write to{' '}
              <Link href={`mailto:${SUPPORT_EMAIL}`} style={link}>
                {SUPPORT_EMAIL}
              </Link>
              .
            </Text>
            <Text style={{ ...footerText, marginTop: '8px' }}>
              Skin Grocer · Dispatched from Melbourne, Australia ·{' '}
              <Link href={SITE_URL} style={link}>
                skingrocer.com.au
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
