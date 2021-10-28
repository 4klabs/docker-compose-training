import express from 'express';
import amqp from 'amqplib';

const app = express();

app.use(express.json());

let rabbitChannel;
const queues = {
  mail: 'send_mail',
  backup: 'backup_product',
};

app.post('/', async (req, res) => {
  const { products } = req.body;

  if (!rabbitChannel) {
    res.status(500).send({ message: 'RabbitMQ is down' });
  }

  for (const product of products) {
    const message = Buffer.from(JSON.stringify(product));
    rabbitChannel.sendToQueue(queues.mail, message);
    rabbitChannel.sendToQueue(queues.backup, message);
    console.log(`Product ${product.id} was sent`);
  }

  res.sendStatus(204);
});

app.listen(3000, () => {
  amqp
    .connect(process.env.RABBITMQ_URL)
    .then((connection) => connection.createChannel())
    .then((channel) => {
      channel.assertQueue(queues.mail, { durable: true });
      channel.assertQueue(queues.backup, { durable: true });
      rabbitChannel = channel;
      console.log('RabbitMQ connected');
    });
  console.log('API running');
});
