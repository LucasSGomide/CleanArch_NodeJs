import { CreateAccountUseCase } from '../CreateAccountUseCase'

describe('CreateAccountUseCase', () => {
    test('Should call Encrypter with correct password', async () => {
        class EncrypterStub {
            async encrypt(value: string): Promise<string> {
                return Promise.resolve('hashed_password')
            }
        }

        const encrypterStub = new EncrypterStub()

        const sut = new CreateAccountUseCase(encrypterStub)
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }

        await sut.create(accountData)

        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
})
