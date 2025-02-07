import exphbs from "express-handlebars";

// Create the Handlebars instance with helpers
const hbs = exphbs.create({
    helpers: {
        eq: (a, b) => a === b,
        and: (a, b) => a && b,
        or: (a, b) => a || b
    }
});

export default hbs