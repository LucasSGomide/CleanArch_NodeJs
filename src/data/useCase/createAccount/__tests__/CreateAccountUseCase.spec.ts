import { IEncrypter } from '../../../protocols/IEncrypter'
import { CreateAccountUseCase } from '../CreateAccountUseCase'

type SutTypes = {
    sut: CreateAccountUseCase
    encrypterStub: IEncrypter
}

const makeEncrypter = (): IEncrypter => {
    class EncrypterStub implements IEncrypter {
        async encrypt(value: string): Promise<string> {
            return Promise.resolve('hashed_password')
        }
    }

    return new EncrypterStub()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
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

    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()

        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            Promise.reject(new Error())
        )

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }

        const promise = sut.create(accountData)

        await expect(promise).rejects.toThrow()
    })

    // test('Should receive an hased password from CreateAccountUseCase', () => {})
})
