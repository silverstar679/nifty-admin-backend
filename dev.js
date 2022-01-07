"use strict";

const app = require("./src/app");
const port = process.env.PORT || 8000;

// Listen to server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
