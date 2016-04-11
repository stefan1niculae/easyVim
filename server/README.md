# easyVim Node Server

What you need:
  NodeJs
  MongoDB
  .env file

  First time:
    Run in your project root:
      --npm install--

  For build:
    npm start (the server restarts automatically if files are being modified)
    
To add new dependences: 
  --for tools-- 
    npm install --save [dependency-name]
    npm install --save-dev [dependency-name]
    
    
Modify file node_modules/connect-ensure-login/lib/ensureLoggedIn.js to :

module.exports = function ensureLoggedIn(options) {
  if (typeof options == 'string') {
    options = { redirectTo: options }
  }
  options = options || {};

  var url = options.redirectTo || '/login';
  var setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;
  var sendHTTPCode = (options.sendHTTPCode === undefined) ? false : options.sendHTTPCode;

  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if(sendHTTPCode){
        return res.send(401);
      }else{
        if (setReturnTo && req.session) {
          req.session.returnTo = req.originalUrl || req.url;
        }
        return res.redirect(url);
      }
    }
    next();
  }
}
