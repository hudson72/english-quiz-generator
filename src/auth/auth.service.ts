import { Injectable } from '@nestjs/common';
import {Response} from 'express';
import {AuthLoginDto} from "./dto/auth-login.dto";
import {Users} from "../users/users.entity";
import {hashPass} from "../utils/hash-pass";
import {v4 as uuid} from 'uuid';
import {sign} from 'jsonwebtoken';
import {JwtPayload} from "./jwt.strategy";

@Injectable()
export class AuthService {

    private createToken(currTokenId: string): {accessToken: string, expiresIn: number} {
        const payload: JwtPayload = {id: currTokenId};
        const expiresIn = 60 * 60 * 24;
        const accessToken = sign(payload, 'dfrnjgiu5r768-043o-405890-23 %%$^%RTYGJ:OJKML<@~:LK@KS:NIUUYS', {expiresIn});
        return {
            accessToken,
            expiresIn,
        };
    };

    private async generateToken(user: Users): Promise<string> {
        let token;
        let userWithThisToken = null;
        do {
            token = uuid();
            userWithThisToken = await Users.findOne({where: {currTokenId: token}});
        } while (!!userWithThisToken);
        user.currTokenId = token;
        await user.save();

        return token;
    }

    async login(req: AuthLoginDto, res: Response): Promise<any> {
        try {
            const user = await Users.findOne({where: {
                    email: req.email,
                    passHash: hashPass(req.pass),
                }});

            if (!user) {
                return res.json({error: 'Invalid login data!'});
            }

            const token = this.createToken(await this.generateToken(user));

            return res
                .cookie('jwt', token.accessToken, {
                    secure: false,
                    domain: 'localhost',
                    httpOnly: true,
                })
                .json({ok: true});
        } catch (e) {
            return res.json({error: e.message})
        }
    };

    async logout(user: Users, res: Response) {
        try {
            user.currTokenId = null;
            await user.save();
            res.clearCookie(
                'jwt',
                {
                    secure: false,
                    domain: 'localhost',
                    httpOnly: true,
                }
            );
            return res.json({ok: true});
        } catch (e) {
            return res.json({error: e.message});
        }
    }
}
