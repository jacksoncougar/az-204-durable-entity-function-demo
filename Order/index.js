/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by a client function.
 *
 * Before running this sample, please:
 * - create a Durable entity HTTP function
 * - run 'npm install durable-functions' from the root of your app
 */

const df = require("durable-functions");

module.exports = df.entity(function (context) {
  const currentValue = context.df.getState(() => {
    return {
      done: false,
      toppings: [],
    };
  });
  switch (context.df.operationName) {
    case "add toppings":
      {
        const toppings = context.df.getInput();
        currentValue.toppings = toppings;
        context.df.setState(currentValue);
      }
      break;
    case "delete toppings":
      currentValue.toppings = [];
      context.df.setState(currentValue);
      break;
    case "make":
      currentValue.done = true;
      context.df.setState(currentValue);
      break;
    case "get":
      context.df.return(currentValue);
      break;
  }
});
