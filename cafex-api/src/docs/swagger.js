import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API CafeX",
      version: "1.0.0",
      description: "Documentação da API CafeX",
    },
    servers: [
      {
        url: "http://localhost:3334/api",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
