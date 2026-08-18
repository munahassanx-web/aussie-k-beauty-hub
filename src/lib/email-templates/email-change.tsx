import * as React from 'react'

import { Button, Link, Text } from '@react-email/components'
import { BrandShell, button, link, text } from './brand-shell'

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail). For the
  // NEW-recipient half of a secure email_change fanout, `email` equals the
  // recipient (NEW), so the "from" line must render oldEmail.
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ oldEmail, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <BrandShell preview="Confirm your email change for Skin Grocer" heading="Confirm your email change">
    <Text style={text}>
      You asked to change the email on your Skin Grocer account from{' '}
      <Link href={`mailto:${oldEmail}`} style={link}>
        {oldEmail}
      </Link>{' '}
      to{' '}
      <Link href={`mailto:${newEmail}`} style={link}>
        {newEmail}
      </Link>
      .
    </Text>
    <Button style={button} href={confirmationUrl}>
      Confirm email change
    </Button>
    <Text style={{ ...text, margin: '24px 0 0' }}>
      If you didn&apos;t request this change, please secure your account immediately.
    </Text>
  </BrandShell>
)

export default EmailChangeEmail
