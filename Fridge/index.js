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
      contents: {
        onion: true,
        mushroom: true,
      },
    };
  });
  switch (context.df.operationName) {
    case "get ingredient":
      const { sender, ingredient } = context.df.getInput();
      context.log(
        `The air inside the fridge is getting cold. And the cook can see their breath.`
      );
      result = currentValue.contents[ingredient];
      context.df.signalEntity(sender, "get ingredient", { ingredient, result });

      break;
  }
});
