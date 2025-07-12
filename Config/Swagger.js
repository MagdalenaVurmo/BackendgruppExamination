import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Airbean API",
    version: "1.0.0",
    description: "Grupp-examination Backend",
  },
  servers: [
    {
      url: "http://localhost:3030",
      description: "Lokal utvecklingsserver",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          name: { type: "string", example: "Espresso" },
          price: { type: "number", example: 28 },
          description: { type: "string", example: "En liten men stark kaffe." },
        },
      },
      Info: {
        type: "object",
        properties: {
          title: { type: "string", example: "Airbean" },
          desc: { type: "string", example: "Vi brygger kaffe med kärlek!" },
          ownerName: { type: "string", example: "Arne Arnesson" },
          ownertitle: { type: "string", example: "VD" },
          img: { type: "string", example: "https://example.com/logo.png" },
        },
      },
      OrderResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Orden har skapats!" },
          data: {
            type: "object",
            properties: {
              userId: { type: "string" },
              orderNr: { type: "string" },
              orderDate: { type: "string", format: "date-time" },
              ETA: { type: "string", format: "date-time" },
              delivered: { type: "boolean" },
              totalPrice: { type: "number" },
              totalOrder: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    productId: { type: "number" },
                    name: { type: "string" },
                    quantity: { type: "number" },
                    price: { type: "number" },
                    total: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
      OrderHistoryResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderResponse" }
          }
        }
      },
      SignupUser: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "test@example.com" },
          password: { type: "string", example: "123456" },
        },
      },
      SigninUser: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      SigninResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  username: { type: "string" },
                  email: { type: "string" },
                },
              },
              accessToken: { type: "string" },
              expiresIn: { type: "string", example: "3h" },
            },
          },
        },
      },
      OrderRequest: {
        type: "object",
        properties: {
          totalOrder: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                quantity: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Hämta hela kaffemenyn",
        responses: {
          200: {
            description: "Lyckad hämtning",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
      },
    },
    "/info": {
      get: {
        tags: ["Info"],
        summary: "Hämta företagsinformation om Airbean",
        responses: {
          200: {
            description: "Info hämtad",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Info" },
              },
            },
          },
        },
      },
    },
    "/user/signup": {
      post: {
        tags: ["User"],
        summary: "Registrera en ny användare",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignupUser" },
            },
          },
        },
        responses: {
          201: {
            description: "Användare skapad",
          },
          400: { description: "Ogiltig indata" },
        },
      },
    },
    "/user/signin": {
      post: {
        tags: ["User"],
        summary: "Logga in användare",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SigninUser" },
            },
          },
        },
        responses: {
          200: {
            description: "Inloggning lyckades",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SigninResponse" },
              },
            },
          },
        },
      },
    },
    "/orders/order": {
      post: {
        tags: ["Orders"],
        summary: "Skapa en ny order",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OrderRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Order skapad",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
              },
            },
          },
          401: { description: "Token saknas eller ogiltig" },
        },
      },
    },
    "/orders/history": {
      get: {
        tags: ["Orders"],
        summary: "Hämta orderhistorik för användare",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Orderhistorik hämtad",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderHistoryResponse" },
              },
            },
          },
          401: { description: "Token saknas eller ogiltig" },
        },
      },
    },
    "/orders/{orderNr}": {
      get: {
        tags: ["Orders"],
        summary: "Hämta specifik order baserat på ordernummer",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "orderNr",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Orderdata hämtad",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
              },
            },
          },
          401: { description: "Token saknas eller ogiltig" },
          404: { description: "Order hittades inte" },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};

export const swaggerDocs = swaggerJSDoc(options);