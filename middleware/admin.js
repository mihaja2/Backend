const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    //get token from header
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({msg: 'Unauthorized access'});
    }

    //verify token
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        if(decoded.user.role !== 'admin'){
            return res.status(401).json({msg: 'Unauthorized access'});
        }
        req.user = decoded.user
        next();
    }
    catch(err){
        return res.status(401).json({msg: 'token invalid'});
    }
}