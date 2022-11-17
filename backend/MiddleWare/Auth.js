const jwt = require('jsonwebtoken');
const _secret='a3ze20p8oi48uf01g1a5o6z9f94z';

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, _secret);
    const userId = decodedToken.userId;
    req.auth = {
      "userId": userId
    };
    next();
  } catch(error) {
    res.status(401).json({ error });
  }
};
