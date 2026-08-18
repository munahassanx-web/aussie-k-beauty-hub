import * as React from 'react'

import { Button, Text } from '@react-email/components'
import { BrandShell, button, text } from './brand-shell'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <BrandShell preview={`Reset your password for ${siteName}`} heading="Reset your password">
    <Text style={text}>
      We received a request to reset the password on your Skin Grocer account. Choose a new one below.
    </Text>
    <Button style={button} href={confirmationUrl}>
      Reset password
    </Button>
    <Text style={{ ...text, margin: '24px 0 0' }}>
      If you didn&apos;t request this, ignore this email — your password will not change.
    </Text>
  </BrandShell>
)

export default RecoveryEmail
