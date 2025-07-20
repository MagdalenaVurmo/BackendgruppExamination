import joi from "joi";



// Valideringsschema för användare
// Används för att säkerställa att användardata är korrekt formaterad 
// och uppfyller nödvändiga krav innan den sparas i databasen. 
// Säkerställer att endast giltiga användare skapas.
// Användas för att validera inloggningsuppgifter.
// Säkerställer att användare har angett en giltig e-postadress
// och ett lösenord som uppfyller minimikraven.


export const userSchema = joi.object({ 
  password: joi.string().min(6).required().messages({
    "string.min": "Lösenordet måste vara minst 6 tecken långt.",
    "any.required": "Lösenordet är obligatoriskt.",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Ogiltigt e-postformat.",
    "any.required": "E-post är obligatoriskt.",
  }),
});




// Validate user schema
// Validerar användardata innan den sparas i databasen
// Säkerställer att användardata är korrekt formaterad och uppfyller nödvändiga krav
// Används för att säkerställa att endast giltiga användare skapas
// Används för att validera inloggningsuppgifter
// Säkerställer att användare har angett en giltig e-postadress
// och ett lösenord som uppfyller minimikraven.
export const orderItemSchema = joi.object({
  id: joi.number().integer().positive().required().messages({
    "number.base": "Id:t måste vara ett nummer",
    "any.required": "Id är obligatoriskt.",
  }),
  quantity: joi.number().integer().min(1).default(1).optional().messages({
    "number.base": "Quantity måste vara ett nummer",
    "number.min": "Antal måste vara minst 1.",
  }),
});


// Schema for validating order items.
// Den används för att validera orderdata innan den sparas i databasen.
// Den säkerställer också att orderdata är korrekt formaterad och uppfyller nödvändiga krav.
// Används för att säkerställa att endast giltiga order skapas.
// Den används för att validera orderuppgifter.
// Säkerställer att order har minst en produkt med ett giltigt id och kvantitet och att ordern är korrekt strukturerad.
export const orderSchema = joi.object({
  totalOrder: joi.array().items(orderItemSchema).min(1).required().messages({
    "array.base": "Ordern måste vara en array.",
    "array.min": "Ordern får inte vara tom.",
    "any.required": "Order-array är obligatorisk.",
  }),
});




// Validate order schema
// Validerar ordernummer för att säkerställa att det är i korrekt format.
// Används för att säkerställa att ordernummer är giltiga.
// Den säkerställer att ordernummer är korrekt formaterade och att de uppfyller nödvändiga krav.
// Används för att validera ordernummer vid hämtning av specifika ordrar.
// Säkerställer att ordernummer är i rätt format och kan användas för att identifiera ordrar i databasen.

export const orderIdSchema = joi.object({
  orderNr: joi
    .string().guid({ version: ["uuidv4"] }).required().messages({
      "string.base": "Ordernummer måste vara en sträng.",
      "string.guid": "Ogiltigt format, förväntas ett giltigt UUID.",
      "any.required": "Ordernummer är obligatoriskt.",
    }),
});




// Valideringsschema för signup
// Används för att validera inloggningsuppgifter.
export const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

// Valideringsschema för signin (login)
// Används för att validera inloggningsuppgifter.
export const signinSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

// Middleware för att köra validering
// OM valideringen misslyckas returneras ett felmeddelande.
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message).join(", "),
      });
    }
    next();
  };
};