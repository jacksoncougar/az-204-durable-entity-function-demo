const df = require("durable-functions");

module.exports = async function (context, req) {
  const client = df.getClient(context);
  const id = `O${context.bindingData.id}`;
  const entityId = new df.EntityId("Order", id);

  if (req.method === "POST") {
    const toppings = req.body.toppings;
    await client.signalEntity(entityId, "add toppings", toppings);
  } else if (req.method === "DELETE") {
    await client.signalEntity(entityId, "delete toppings");
  } else {
    const stateResponse = await client.readEntityState(entityId);
    return { body: stateResponse.entityState.toppings };
  }
};
