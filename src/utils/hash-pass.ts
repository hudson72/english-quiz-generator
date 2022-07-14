import * as crypto from 'crypto';

export const hashPass = (p: string): string => {
    const hmac = crypto.createHmac('sha512', 'uesdhr74385%^$^&(*H&*JML;m yg^^LGYUI^ALIbyycsu6^&^*&Y*(vgDXGFCHG');
    hmac.update(p);
    return hmac.digest('hex');
}