import bcrypt from "bcrypt";

export const __decryptPassword = async (inputFromRequest: string, passwordFromUserBDD: string):Promise<boolean> => {
    return await bcrypt.compare(inputFromRequest, passwordFromUserBDD);
}

export const __hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}

