import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';
import { Request as ExpressRequest } from 'express';
import * as jwksRsa from 'jwks-rsa';
import { Request } from '../utils/express';
import User from '../model/User';
import { defineAbilitiesFor } from '../utils/abilities';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKeyProvider: jwksRsa.passportJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://cdein.eu.auth0.com/.well-known/jwks.json',
  }),
  jsonWebTokenOptions: {
    issuer: 'https://cdein.eu.auth0.com',
    audience: [
      'https://api.case-based-reasoning.org',
      'm4baaRyqUhaKqAos3T4W24ZGg0FJa4ox',
    ],
    algorithms: ['RS256'],
  },
  passReqToCallback: true,
};

/*

    {
        "nickname": "christian.dein",
        "name": "christian.dein@dein-hosting.de",
        "picture": "https://s.gravatar.com/avatar/01eac6be072c6ee3e67e188d11f58b8b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fch.png",
        "updated_at": "2020-05-29T09:46:10.320Z",
        "iss": "https://cdein.eu.auth0.com/",
        "sub": "auth0|57de9268dad37fb021a82bbc",
        "aud": "m4baaRyqUhaKqAos3T4W24ZGg0FJa4ox",
        "iat": 1590745570,
        "exp": 1590781570
    }

 */
async function authenticationHandler(
  req: ExpressRequest,
  jwt: any,
  done: VerifiedCallback
) {
  const { logger } = req as Request;
  const { sub: subject, aud: audience } = jwt;
  logger.debug({ jwt });
  try {
    let user = await User.findOne({ subject, audience }).exec();
    if (!user) {
      user = await new User({
        subject,
        audience,
        permissions: ['read:inquiry'],
      }).save();
    }
    const userObject = user.toObject();
    (req as Request).ability = defineAbilitiesFor(userObject);
    done(null, userObject);
  } catch (err) {
    logger.error(
      { error: err, stack: err.stack },
      'failed loading user permissions.'
    );
    done({ status: 403, code: 'Forbidden' });
  }
}

export function Authentication() {
  passport.use(new JwtStrategy(opts, authenticationHandler));
  return passport.initialize();
}
