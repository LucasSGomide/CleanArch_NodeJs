import bcrypt from 'bcrypt'

import { IEncrypter } from '../../data/protocols/IEncrypter'

export class BcryptAdapter implements IEncrypter {
    private readonly saltRounds: number

    constructor(saltRounds: number) {
        this.saltRounds = saltRounds
    }

    async encrypt(value: string): Promise<string> {
        await bcrypt.hash(value, this.saltRounds)
        return null
    }
}
