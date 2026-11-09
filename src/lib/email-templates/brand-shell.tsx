import { BRAND_PALETTE } from '@/lib/brand-palette'
import * as React from 'react'

import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text, Img } from '@react-email/components'

export const NAVY = BRAND_PALETTE.navy
export const CREAM = BRAND_PALETTE.cream
export const INK = BRAND_PALETTE.ink
export const MUTED = BRAND_PALETTE.muted
export const RULE = BRAND_PALETTE.silver

export const SITE_URL = 'https://skingrocer.com.au'
export const SUPPORT_EMAIL = 'customercare@skingrocer.com.au'

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
const brandline = {
  margin: '8px 0 0',
  fontSize: '10px',
  letterSpacing: '0.28em',
  textTransform: 'uppercase' as const,
  color: BRAND_PALETTE.gold,
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
            <Img src={`${SITE_URL}/email/sg-logo-milk.png`} alt="Skin Grocer 스킨그로서" width="200" height="50" style={{ margin: "0 auto" }} />
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
