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
  const currentValue = context.df.getState(() => ({
    toppings: {},
  }));
  const fridgeId = new df.EntityId("Fridge", "F1");
  switch (context.df.operationName) {
    case "make order":
      const { toppings } = context.df.getInput();

      currentValue.toppings = toppings.reduce((acc, topping) => {
        acc[topping] = "pending";
        return acc;
      }, {});

      context.df.setState(currentValue);

      for (const topping of toppings) {
        context.log(`The cook opens the fridge and checks if ${topping} is available`);
        context.df.signalEntity(fridgeId, "get ingredient", {
          sender: context.df.entityId,
          ingredient: topping,
        });
      }
      break;
    case "get ingredient":
      const { ingredient, result } = context.df.getInput();
      if (result) {
        context.log(`The cook sees ${ingredient} at the back of the fridge.`);
      } else {
        context.log(`The cook doesn't find ${ingredient} in the fridge.`);
      }

      currentValue.toppings[ingredient].result = result;
      break;
  }
});
