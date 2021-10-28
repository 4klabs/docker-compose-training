import express from 'express';
import amqp from 'amqplib';

const app = express();

app.use(express.json());

const queue = 'send_mail';
let rabbitChannel;

app.post('/', async (req, res) => {
  const { products } = req.body;

  for (const product of products) {
    rabbitChannel.sendToQueue(queue, Buffer.from(JSON.stringify(product)));
    console.log(`Product ${product.id} was sent`);
  }

  res.sendStatus(204);
});

app.listen(3000, () => {
  amqp
    .connect(process.env.RABBITMQ_URL)
    .then((connection) => connection.createChannel())
    .then((channel) => {
      channel.assertQueue(queue, { durable: true });
      rabbitChannel = channel;
      console.log('RabbitMQ connected');
    });
  console.log('API running');
});
