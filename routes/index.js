module.exports.index = function(req, res) {
  res.render('index');
};

module.exports.partials = function(req, res) {
  res.render('partials/' + req.params.name);
};