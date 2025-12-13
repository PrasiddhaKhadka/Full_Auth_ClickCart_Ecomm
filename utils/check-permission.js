const CustomAPIError = require('../errors')

const checkPermission = async(reqeustUser, resourceUserId)=>{
    if(reqeustUser.role === 'admin' )return;
    if(reqeustUser.userId === resourceUserId.toString())return;
    throw new CustomAPIError.UnauthorizedError(
    'Not authorized to access this route'
  );
}
 
module.exports = checkPermission; 