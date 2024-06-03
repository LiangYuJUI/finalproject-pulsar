const Pulsar = require("pulsar-client");

(async () => {
    // Create a client
    const client = new Pulsar.Client({
        serviceUrl: "pulsar://localhost:6650",
        operationTimeoutSeconds: 30,
    });

    // Create a producer
    const producer = await client.createProducer({
        topic: "persistent://public/default/my-topic",
        sendTimeoutMs: 30000,
        batchingEnabled: false,
    });

    // Send messages
    let count = 1;
    const sendMessage = () => {
        const msg = `my-message-${count}`;
        const key = `key-${count % 3}`;
        producer.send({
            data: Buffer.from(msg), 
            partitionKey: key
        });
        console.log(`Sent message with key '${key}': ${msg}`);
        count++;
    };

    // Set interval to send messages every 5 seconds (adjust time interval as needed)
    setInterval(sendMessage, 1000);

    // Allow some time for the last batch of messages to be sent before closing producer and client
    setTimeout(async () => {
        await producer.close();
        await client.close();
    }, 180000); // Close producer and client after 1 minute
})();