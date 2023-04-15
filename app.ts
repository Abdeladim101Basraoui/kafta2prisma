const { Kafka } = require("kafka-node");
const { PrismaClient } = require("@prisma/client");
const express = require("express");

const kafkaClient = new Kafka.kafkaClient({
  kafkaHost: "localhost:9092",
});

const kafkaConsumer = new Kafka.Consumer(kafkaClient, [{ topic: "test" }]);

// Instantiate Prisma client
const prisma = new PrismaClient();

const prismaClient = new PrismaClient();

kafkaConsumer.on("message", async (message: any) => {
  try {
    console.log(message);
    //     const result = await prismaClient.history.create({
    //         data: {
    //             name: message.value,
    //         },
    //     });
    //     console.log(result);
  } catch (err) {
    console.log(err);
  }
});


const app = express();
const port = 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

kafkaClient.on("error", (err: any) => {
  console.log(err);
});

kafkaConsumer.on("error", (err: any) => {
  console.log(err);
});

kafkaConsumer.on("ready", () => {
  console.log("Kafka consumer is ready");
});
