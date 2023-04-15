// Import required libraries
import express from "express";
import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";

// Create an Express app
const app = express();

// Create a KafkaJS client
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"], // Update with the appropriate Kafka broker address
});

// Create a Prisma client
const prisma = new PrismaClient();

// Define a route to read data from Kafka and store it with Prisma
app.get("/consume", async (req, res) => {
  try {
    // Create a Kafka consumer
    const consumer = kafka.consumer({ groupId: "my-group" });

    // Define a function to handle consumed messages
    const handleMessage = async (message) => {
      try {
        // Parse the message payload
        const payload = JSON.parse(message.value?.toString() || "");

        console.log(payload ? payload : `no data is here :${payloads}`);
        // // Store the payload in Prisma
        // await prisma.history.create({ data: payload });

        // // Commit the message to mark it as consumed
        // await consumer.commitOffsets([
        //   {
        //     topic: message.topic,
        //     partition: message.partition,
        //     offset: message.offset,
        //   },
        // ]);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    // Start consuming messages
    await consumer.connect();
    await consumer.subscribe({ topic: "my-topic" }); // Update with the appropriate topic name
    await consumer.run({ eachMessage: handleMessage });

    res.status(200).send("Data consumption started successfully.");
  } catch (error) {
    console.error("Error consuming data:", error);
    res.status(500).send("Error consuming data.");
  }
});

// Start the Express app
app.listen(3000, () => {
  console.log("Express app listening on http://localhost:3000");
});
