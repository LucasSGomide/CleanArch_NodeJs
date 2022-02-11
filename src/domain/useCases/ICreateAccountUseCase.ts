import { AccountModel } from '../models/AccountModel'

export type CreateAccountModel = {
    name: string
    email: string
    password: string
}

export interface ICreateAccountUseCase {
    create(account: CreateAccountModel): Promise<AccountModel>
}
