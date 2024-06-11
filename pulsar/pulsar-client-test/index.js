const Pulsar = require("pulsar-client");

async function pulsarTest() {
  // Create a client
  try {
    const client = new Pulsar.Client({
      serviceUrl: "pulsar://localhost:6650",
      // serviceUrl: "https://527d-2001-b011-4004-daba-d04d-a342-3cc6-2ea4.ngrok-free.app"
      operationTimeoutSeconds: 300000
    });
    console.log(client)
    console.log("client test\n");

    // Create a producer
    const producer = await client.createProducer({
      topic: "persistent://public/default/my-topic",
    });

    console.log(producer)
    console.log("producer test\n")

    // Create a consumer
    const consumer = await client.subscribe({
      topic: "persistent://public/default/my-topic",
      subscription: "sub1",
    });
    console.log(consumer)
    console.log("consumer test\n")

    // Send a message
    await producer.send({
      data: Buffer.from("hello"),
    });
    console.log("success send\n ")

    // Receive the message
    const msg = await consumer.receive();
    console.log("get", msg.getData().toString());
    await consumer.acknowledge(msg);

    console.log("success receive");

    await producer.close();
    await consumer.close();
    await client.close();
  } catch (error) {
    console.log(error);
  }
}

pulsarTest();