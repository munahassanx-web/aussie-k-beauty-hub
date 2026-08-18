import * as React from 'react'

import { Text } from '@react-email/components'
import { BrandShell, code, text } from './brand-shell'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <BrandShell preview="Your Skin Grocer verification code" heading="Confirm it's you">
    <Text style={text}>Use the code below to confirm your identity:</Text>
    <Text style={code}>{token}</Text>
    <Text style={{ ...text, margin: '24px 0 0' }}>
      This code expires shortly. If you didn&apos;t request it, you can safely ignore this email.
    </Text>
  </BrandShell>
)

export default ReauthenticationEmail
