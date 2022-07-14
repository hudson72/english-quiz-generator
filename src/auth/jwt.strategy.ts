import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from 'passport-jwt';
import {Users} from "../users/users.entity";

export interface JwtPayload {
    id: string;
}

function cookieExtractor(req: any): null | string {
    return (req && req.cookies) ? (req.cookies?.jwt ?? null) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: 'dfrnjgiu5r768-043o-405890-23 %%$^%RTYGJ:OJKML<@~:LK@KS:NIUUYS'
        });
    }

    async validate(payload: JwtPayload, done: (error, user) => void) {
        if (!payload || !payload.id) {
            return done(new UnauthorizedException(), false);
        }

        const user = await Users.findOne({where: {currTokenId: payload.id}});
        if (!user) {
            return done(new UnauthorizedException(), false);
        }

        done(null, user);
    }

}