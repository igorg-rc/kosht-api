const preHandler = model => {
  (req, res, next) => {
    model.count({}, (err, count) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error!');
      }
      res.header('Content-Range', `notes 0-10}/${count}`);
      next();
    });
  } 
};

module.exports = preHandler;