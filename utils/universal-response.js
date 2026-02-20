module.exports = function universalResponse(req, res, next) {
  const oldJson = res.json.bind(res);

  res.json = function (body) {
    try {
      if (body && typeof body === 'object') {
        if (Object.prototype.hasOwnProperty.call(body, 'success')) {
          return oldJson(body);
        }

        if (Object.prototype.hasOwnProperty.call(body, 'error') || Object.prototype.hasOwnProperty.call(body, 'errors')) {
          return oldJson({ success: false, error: body.error || body.errors });
        }

        return oldJson({ success: true, data: body });
      }

      // non-object bodies (strings, numbers)
      return oldJson({ success: true, data: body });
    } catch (err) {
      return oldJson({ success: false, error: 'Response formatting error' });
    }
  };

  next();
};
