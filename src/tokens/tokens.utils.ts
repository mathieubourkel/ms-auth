import * as jwt from "jsonwebtoken";

export const __createEmailToken = (userId: number, email:string):string => {
    let date:Date = new Date();
    const emailDate:number = date.setHours(date.getHours() + 24)

    const emailToken:string = jwt.sign(
      { userId, email, exirationDate: emailDate },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    return emailToken
  }

  export const __createValidationToken = (userId: number, email:string):string => {
    let date:Date = new Date();
    const validationDate:number = date.setHours(date.getHours() + 24)

    const validationToken:string = jwt.sign(
      { userId, email, exirationDate: validationDate },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    return validationToken
  }


  export const __createTokens = (userId: number, email: string, firstname: string, lastname:string):{token:string, refreshToken:string} => {
    let date:Date = new Date();
    const tokenDate:number = date.setHours(date.getHours() + 24)
    const refreshDate:number = date.setDate(date.getDate() + 4 * 7)
    const token:string = jwt.sign(
      { userId, email, firstname, lastname, exirationDate: tokenDate },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    const refreshToken:string = jwt.sign(
      { userId, email, exirationDate: refreshDate },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "4w" }
    );

    return {token, refreshToken}
  }