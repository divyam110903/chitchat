import JWT from 'jsonwebtoken';
export const generateToken = (userid,res) =>{
    const token=JWT.sign({userid},process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
res.cookie('jwt',token,{
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, //prevent xss attacks
    sameSite:"strict", //prevent csrf attacks
    secure:process.env.NODE_ENV !== 'development', //use secure cookies in production
})
return token;
}
    