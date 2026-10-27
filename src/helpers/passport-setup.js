const passport = require('passport');
const { config } = require('../config/app.config');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true,

},
(request, accessToken, refreshToken, profile, done) => {
    console.log(profile); 
    return done(null, profile);
})); 

passport.serializeUser( (user, done) => {

    done(null, user);
});
passport.deserializeUser( (user, done) => {

    done(null, user);

});