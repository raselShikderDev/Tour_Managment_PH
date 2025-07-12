import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"


export const GenerateAccessToken = async (jwtPayload:JwtPayload, secret:string, expires:string) =>{
        const accessToken = jwt.sign(jwtPayload, secret, {expiresIn: expires} as SignOptions)
        return accessToken
}

export const verifyJwtToken = (accessToken:string, secret:string)=>{
     const verifiedToekn = jwt.verify(accessToken, secret);
     return verifiedToekn
}


// export const CompareJwtToken = async (password:string, existingPassword:string)=>{
//     const comparePassword = bcrypt.compare(password, existingPassword)
//     return comparePassword
// }

