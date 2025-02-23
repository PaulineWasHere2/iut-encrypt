// Extrait du fichier RabbitMQService.js
const amqp = require('amqplib/callback_api');

class RabbitMQService {
  static sendMessage(queue, message) {
    return new Promise((resolve, reject) => {
      amqp.connect(process.env.RABBITMQ_URL, (err, connection) => {
        if (err) return reject(err);

        connection.createChannel((err, channel) => {
          if (err) return reject(err);

          channel.assertQueue(queue, { durable: true });
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
          console.log('Message envoyé à la queue:', queue);
          resolve();
        });
      });
    });
  }
}

module.exports = RabbitMQService;
