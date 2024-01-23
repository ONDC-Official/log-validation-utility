// import crypto from 'crypto'
import * as _sodium from 'libsodium-wrappers'

export const sign = async ({ message, privateKey }: { message: string; privateKey: string }) => {
  await _sodium.ready
  const sodium = (_sodium as any).default as typeof _sodium

  const signedMessage = sodium.crypto_sign_detached(
    message,
    sodium.from_base64(privateKey, _sodium.base64_variants.ORIGINAL),
  )
  return sodium.to_base64(signedMessage, _sodium.base64_variants.ORIGINAL)
}

export const hash = async ({ message }: { message: string }) => {
  await _sodium.ready
  const sodium = (_sodium as any).default as typeof _sodium

  const signedMessage = sodium.crypto_generichash(64, sodium.from_string(message))

  return sodium.to_base64(signedMessage, _sodium.base64_variants.ORIGINAL)
}

export const verify = async ({
  signedMessage,
  message,
  publicKey,
}: {
  signedMessage: string
  message: string
  publicKey: string
}) => {
  try {
    await _sodium.ready
    const sodium = (_sodium as any).default as typeof _sodium
    const isVerified = sodium.crypto_sign_verify_detached(
      sodium.from_base64(signedMessage, _sodium.base64_variants.ORIGINAL),
      message,
      sodium.from_base64(publicKey, _sodium.base64_variants.ORIGINAL),
    )
    return isVerified
  } catch (error) {
    return false
  }
}
