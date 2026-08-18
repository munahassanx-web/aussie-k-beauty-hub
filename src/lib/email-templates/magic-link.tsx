import * as React from 'react'

import { Button, Text } from '@react-email/components'
import { BrandShell, button, text } from './brand-shell'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <BrandShell preview={`Your login link for ${siteName}`} heading="Your login link">
    <Text style={text}>Use the button below to log in to Skin Grocer. This link expires shortly.</Text>
    <Button style={button} href={confirmationUrl}>
      Log in
    </Button>
    <Text style={{ ...text, margin: '24px 0 0' }}>
      If you didn&apos;t request this link, you can safely ignore this email.
    </Text>
  </BrandShell>
)

export default MagicLinkEmail
