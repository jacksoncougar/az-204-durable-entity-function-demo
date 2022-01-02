const df = require("durable-functions");

module.exports = async function (context, req) {
  const client = df.getClient(context);
  const id = `O${context.bindingData.id}`;
  const entityId = new df.EntityId("Order", id);
  const cookId = new df.EntityId("Cook", "C1");

  if (req.method === "POST") {
    const stateResponse = await client.readEntityState(entityId);
    const toppings = stateResponse.entityState.toppings;

    // join toppings with comma
    const toppingsString = toppings.join(", ");
    context.log(
      `The cook looks at order ${id} and sees they will need ${toppingsString}.`
    );

    await client.signalEntity(cookId, "make order", { toppings });
  }
};
