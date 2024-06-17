const Pulsar = require("pulsar-client");

async function runConsumer() {
  // Create a client
  try {
    const client = new Pulsar.Client({
      serviceUrl: "pulsar://localhost:6650",
      operationTimeoutSeconds: 300000
    });
    console.log(client)


    // Create a consumer
    const consumer = await client.subscribe({
      topic: "persistent://np01/api-v2-charging-set-current/info",
      subscription: "sub2",
      ackTimeoutMs: 800000
    });

    // Continuously receive messages
    while (true) {
      const msg = await consumer.receive(800000);
      
      if (msg) {
        await consumer.acknowledgeId(msg.getMessageId());
        console.log("\x1b[44m%s\x1b[0m", ` -- <pulsar test>`);
        console.log("Received:", msg.getData().toString());
        console.log("Message ID:", msg.getMessageId().toString(), "\n");
      } else {
        console.log("No message received for 800 second. Closing consumer and client.");
        break;
      }
    }

    // Close consumer and client
    await consumer.close();
    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

runConsumer();