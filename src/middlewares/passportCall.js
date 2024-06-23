import passport from "passport";

export const passportCall = (strategy, viewOnFailure) => {
    return function (req, res, next) {
        passport.authenticate(strategy, function (err, user, info, status) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.render(viewOnFailure, { error: info.message ? info.message : info.toString(), ...req.body });
            }
            req.user = user;
            return req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return next();
            });
        })(req, res, next);
    };
};