import amqp from 'amqplib';

const queue = 'send_mail';

(async function () {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });

  console.log(`Listening ${queue} queue`);

  await channel.consume(
    queue,
    (message) => {
      console.log(`Email sent: ${message.content.toString()}`);
    },
    { noAck: true }
  );
})();
