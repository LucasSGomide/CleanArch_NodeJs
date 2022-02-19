import bcrypt from 'bcrypt'
import { BcryptAdapter } from '../BcryptAdapter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return Promise.resolve('hashed_value')
    },
}))

describe('BcryptAdapter', () => {
    test('Should call Bcrypt with correct value', async () => {
        const saltRounds = 12
        const sut = new BcryptAdapter(saltRounds)
        const bcryptSpy = jest.spyOn(bcrypt, 'hash')

        await sut.encrypt('any_value')

        expect(bcryptSpy).toHaveBeenCalledWith('any_value', saltRounds)
    })

    test('Should return hashed value on success', async () => {
        const saltRounds = 12
        const sut = new BcryptAdapter(saltRounds)

        const hashedValue = await sut.encrypt('any_value')

        expect(hashedValue).toBe('hashed_value')
    })
})
