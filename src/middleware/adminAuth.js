import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token){
            return res.json({success: false, message: "Not Authorized please login again"})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        if(token_decode !== process.env.ADMIN_LOGIN + process.env.ADMIN_PASSWORD) {
            return res.json({
              success: false,
              message: "Not Authorized please login again",
            });
        }

        next()
    } catch (error) {
        res.json({
          success: false,
          message: error.message,
        });
    }
}

export default adminAuth