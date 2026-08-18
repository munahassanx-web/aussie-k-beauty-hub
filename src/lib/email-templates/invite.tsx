import * as React from 'react'

import { Button, Text } from '@react-email/components'
import { BrandShell, button, text } from './brand-shell'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ confirmationUrl }: InviteEmailProps) => (
  <BrandShell preview="You've been invited to join Skin Grocer" heading="You've been invited">
    <Text style={text}>
      You&apos;ve been invited to join Skin Grocer. Accept below to create your account.
    </Text>
    <Button style={button} href={confirmationUrl}>
      Accept invitation
    </Button>
    <Text style={{ ...text, margin: '24px 0 0' }}>
      If you weren&apos;t expecting this invitation, you can safely ignore this email.
    </Text>
  </BrandShell>
)

export default InviteEmail
