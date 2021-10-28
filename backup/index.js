import fs from 'fs/promises';
import amqp from 'amqplib';

const queue = 'send_mail';

(async function () {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });

  await channel.consume(queue, processMessage, { noAck: true });
})();

async function processMessage(message) {
  const content = message.content.toString();
  const filename = `./files/${JSON.parse(content).id}.json`;

  fs.writeFile(filename, content).then(() => {
    console.log(`Backup: ${filename}`);
  });
}
