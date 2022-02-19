import bcrypt from 'bcrypt'
import { BcryptAdapter } from '../BcryptAdapter'

const saltRounds = 12

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return Promise.resolve('hashed_value')
    },
}))

const makeSut = (): BcryptAdapter => new BcryptAdapter(saltRounds)

describe('BcryptAdapter', () => {
    test('Should call Bcrypt with correct value', async () => {
        const sut = makeSut()
        const bcryptSpy = jest.spyOn(bcrypt, 'hash')

        await sut.encrypt('any_value')

        expect(bcryptSpy).toHaveBeenCalledWith('any_value', saltRounds)
    })

    test('Should return hashed value on success', async () => {
        const sut = makeSut()

        const hashedValue = await sut.encrypt('any_value')

        expect(hashedValue).toBe('hashed_value')
    })

    test('Should throw on error', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
            // @ts-ignore
            Promise.reject(new Error())
        )

        const promise = sut.encrypt('any_value')

        await expect(promise).rejects.toThrow()
    })
})
