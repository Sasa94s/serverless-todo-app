import 'source-map-support/register'

import {CustomAuthorizerEvent, CustomAuthorizerResult} from 'aws-lambda'

import {verify, decode} from 'jsonwebtoken'
import {Jwt} from '../../auth/Jwt'
import {JwtPayload} from '../../auth/JwtPayload'
import {JwksClient} from "../../auth/JwksClient";
import {createLogger} from '../../utils/logger'

const logger = createLogger('auth')

let cachedCertificate: string

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', {error: e.message})

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  if (!authHeader) {
    throw new Error('No authentication header')
  }
  if (!/^Bearer /i.test(authHeader)) {
    throw new Error('Invalid authentication header')
  }

  const token = getToken(authHeader)
  logger.info("Token", {token})
  const jwt: Jwt = decode(token, {complete: true}) as Jwt
  logger.info("JWT Token", {jwt})

  if (jwt.header.alg !== 'RS256') {
    throw new Error("Unsupported JWT algorithm")
  }

  const cert = await getCertificate()
  return verify(token, cert, {algorithms: ['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  const split = authHeader.split(' ')
  if (split.length !== 2) {
    throw new Error("No authorization token was found")
  }

  return split[1]
}

async function getCertificate(): Promise<string> {
  const keys = await new JwksClient().getJwks()

  if (!keys || !keys.length) {
    throw new Error('No JWKS keys found')
  }

  const signingKeys = keys.filter(
    key => key.use === 'sig'
      && key.kty === 'RSA'
      && key.alg === 'RS256'
      && key.n
      && key.e
      && key.kid
      && (key.x5c && key.x5c.length)
  )
  if (!signingKeys.length) {
    throw new Error('No JWKS signing keys found')
  }

  // XXX: Only handles single signing key
  const key = signingKeys[0]
  const pub = key.x5c[0]  // public key

  // Certificate found!
  cachedCertificate = certToPEM(pub)

  logger.info('Valid certificate found', cachedCertificate)

  return cachedCertificate
}

function certToPEM(cert: string): string {
  cert = cert.match(/.{1,64}/g).join('\n')
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
  return cert
}
