import { IEncrypter } from '../../../protocols/IEncrypter'
import { CreateAccountUseCase } from '../CreateAccountUseCase'

type SutTypes = {
    sut: CreateAccountUseCase
    encrypterStub: IEncrypter
}

const makeSut = (): SutTypes => {
    class EncrypterStub {
        async encrypt(value: string): Promise<string> {
            return Promise.resolve('hashed_password')
        }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new CreateAccountUseCase(encrypterStub)

    return {
        sut,
        encrypterStub,
    }
}

describe('CreateAccountUseCase', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()

        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }

        await sut.create(accountData)

        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should receive an hased password from CreateAccountUseCase', () => {})
})
