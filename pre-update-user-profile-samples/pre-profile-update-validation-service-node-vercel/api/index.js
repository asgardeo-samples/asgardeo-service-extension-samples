module.exports = (req, res) => {
    res.status(200).json({"status": "ok", "message": "Service is running."});
};
