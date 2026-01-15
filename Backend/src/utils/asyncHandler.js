export const asyncHandler = (asyncFunction) =>
    (req, res, next) => {
        try {
            return asyncFunction(req, res, next)
        } catch (error) {
            return next(error)
        }
    }
