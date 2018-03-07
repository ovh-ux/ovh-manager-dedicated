/**
 * Error responses
 */

module.exports[404] = function pageNotFound (req, res) {
    const viewFilePath = "404";
    const statusCode = 404;
    const result = {
        status: statusCode
    };

    res.status(result.status);
    res.render(viewFilePath, {}, (err, html) => {
        if (err) {
            return res.status(result.status).json(result);
        }

        return res.send(html);
    });
};
