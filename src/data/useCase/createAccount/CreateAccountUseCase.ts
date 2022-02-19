import { AccountModel } from '../../../domain/models/AccountModel'
import {
    CreateAccountModel,
    ICreateAccountUseCase,
} from '../../../domain/useCases/ICreateAccountUseCase'
import { IEncrypter } from '../../protocols/IEncrypter'

export class CreateAccountUseCase implements ICreateAccountUseCase {
    private readonly encrypter: IEncrypter

    constructor(encrypter: IEncrypter) {
        this.encrypter = encrypter
    }

    async create(account: CreateAccountModel): Promise<AccountModel> {
        const { password } = account

        await this.encrypter.encrypt(password)
        // const createdAccount: AccountModel = {
        //     id: '',
        //     name: '',
        //     email: '',
        //     password: '',
        // }

        return Promise.resolve(null)
    }
}
