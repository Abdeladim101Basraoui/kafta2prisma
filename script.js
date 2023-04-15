const { Kafka } = require('kafkajs');
const { PrismaClient } = require('@prisma/client');

// Instantiate Prisma client
const prisma = new PrismaClient();

// Create Kafka consumer
const kafka = new Kafka({
  clientId: 'kafka-consumer',
  brokers: ['localhost:9092'], // Replace with your Kafka broker(s) address
});

const consumer = kafka.consumer({ groupId: 'kafka-group' }); // Replace with your consumer group name

// Define Kafka topic to consume from
const topic = 'example-topic'; // Replace with your Kafka topic name

// Function to process Kafka messages
const processMessage = async (message) => {
  try {
    // Extract data from Kafka message
    const { value } = message;
    const data = JSON.parse(value.toString());

    // Store data into Prisma
    await prisma.yourModelName.create({ // Replace with your Prisma model name
      data,
    });

    console.log(`Data stored into Prisma: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error(`Error processing Kafka message: ${error.message}`);
  }
};

// Start Kafka consumer
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message from Kafka: topic=${topic}, partition=${partition}, offset=${message.offset}`);
      await processMessage(message);
    },
  });
};

run().catch((error) => console.error(`Failed to start Kafka consumer: ${error.message}`));
