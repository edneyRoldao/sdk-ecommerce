module.exports = (req, res, next) => {
    const apiKey = req.header("API_KEY");
    const apiKeyEnv = process.env.SECRET_KEYS_API_KEY;

    if (!apiKey) {
        return res.status(400).send('access denied, secret key header is not present');
    }

    if (!apiKeyEnv) {
        return res.status(400).send('access denied, API key is not configured as environment variable');
    }

    if (apiKey != apiKeyEnv) {
        return res.status(400).send('access denied, API key provided is not valid');
    }

    next();
}
