import bcrypt from 'bcrypt'
import { BcryptAdapter } from '../BcryptAdapter'

describe('BcryptAdapter', () => {
    test('Showld call BCrypt with correct value', async () => {
        const saltRounds = 12
        const sut = new BcryptAdapter(saltRounds)
        const bcryptSpy = jest.spyOn(bcrypt, 'hash')

        await sut.encrypt('any_value')

        expect(bcryptSpy).toHaveBeenCalledWith('any_value', saltRounds)
    })
})
