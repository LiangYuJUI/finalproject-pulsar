const Pulsar = require("pulsar-client");

(async () => {
    // Create a client
    const client = new Pulsar.Client({
        serviceUrl: "pulsar://localhost:6650",
        operationTimeoutSeconds: 30,
    });

    // Create a consumer
    const consumer = await client.subscribe({
        topic: "persistent://public/default/my-topic",
        subscription: "sub1",
        subscriptionType: "KeyShared",
        ackTimeoutMs: 10000,
    });

    // Receive messages
    while (true) {
        const msg = await consumer.receive();
        console.log(msg.getData().toString());
        consumer.acknowledge(msg);
    }
})();
