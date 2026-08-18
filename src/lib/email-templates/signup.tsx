import * as React from 'react'

import { Button, Link, Text } from '@react-email/components'
import { BrandShell, button, link, text } from './brand-shell'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ siteName, recipient, confirmationUrl }: SignupEmailProps) => (
  <BrandShell preview={`Confirm your email for ${siteName}`} heading="Confirm your email">
    <Text style={text}>
      Thanks for creating a Skin Grocer account. Confirm{' '}
      <Link href={`mailto:${recipient}`} style={link}>
        {recipient}
      </Link>{' '}
      to track orders, save routines and reorder in one tap.
    </Text>
    <Button style={button} href={confirmationUrl}>
      Verify email
    </Button>
    <Text style={{ ...text, margin: '24px 0 0' }}>
      If you didn&apos;t create an account, you can safely ignore this email.
    </Text>
  </BrandShell>
)

export default SignupEmail
