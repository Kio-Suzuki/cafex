const generalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  let clientMessage;
  if (statusCode >= 400 && statusCode < 500 && err.message) {
    clientMessage = err.message;
  } else {
    clientMessage =
      "Ocorreu um erro inesperado em nossos servidores. Por favor, tente novamente mais tarde.";
  }

  res.status(statusCode).json({
    status: "erro",
    message: clientMessage,
    statusCode: statusCode,
  });
};

export default generalErrorHandler;
