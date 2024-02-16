import * as bcrypt from "bcrypt";

export const __decryptPassword = async (inputFromRequest: string, passwordFromUserBDD: string):Promise<boolean> => {
    return await bcrypt.compare(inputFromRequest, passwordFromUserBDD);
}

export const __hashPassword = (password: string) => {
    return bcrypt.hash(password, 10)
}

