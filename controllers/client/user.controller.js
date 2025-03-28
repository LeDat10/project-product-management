// [POST] /api/users/register
module.exports.register = async (req, res) => {
    try {
        res.json({
            code: 200
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
}