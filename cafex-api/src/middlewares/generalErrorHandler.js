const generalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "erro",
    message: err.message || "Ocorreu um erro inesperado em nossos servidores. Por favor, tente novamente mais tarde.",
    statusCode: statusCode,
  });
};

export default generalErrorHandler;
