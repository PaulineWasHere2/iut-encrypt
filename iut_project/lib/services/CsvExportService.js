// Extrait du fichier CsvExportService.js
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

class CsvExportService {
  static startListening() {
    const amqp = require('amqplib/callback_api');

    amqp.connect(process.env.RABBITMQ_URL, (err, connection) => {
      if (err) {
        console.error('Erreur de connexion à RabbitMQ:', err);
        return;
      }

      connection.createChannel((err, channel) => {
        if (err) {
          console.error('Erreur de création de canal:', err);
          return;
        }

        const queue = 'csv-export-queue';
        channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);

        console.log(`En attente de messages dans la queue ${queue}`);

        channel.consume(queue, async (msg) => {
          const message = JSON.parse(msg.content.toString());
          const { userEmail, movies } = message;

          try {
            // Créer le fichier CSV
            const filePath = path.join(__dirname, '../exports', `movies_${Date.now()}.csv`);
            await CsvExportService.generateCsv(filePath, movies);

            // Envoyer le fichier par email
            await CsvExportService.sendEmail(userEmail, filePath);

            // Confirmer que le message a été traité
            channel.ack(msg);
          } catch (error) {
            console.error('Erreur lors du traitement du message:', error);
            channel.nack(msg);
          }
        });
      });
    });
  }

  static generateCsv(filePath, movies) {
    return new Promise((resolve, reject) => {
      const writer = csvWriter({
        path: filePath,
        header: [
          { id: 'title', title: 'Title' },
          { id: 'director', title: 'Director' },
          { id: 'release_year', title: 'Release Year' },
        ]
      });

      writer.writeRecords(movies)
        .then(() => resolve())
        .catch(reject);
    });
  }

  static sendEmail(userEmail, filePath) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    const mailOptions = {
      from: `"IPTV" <${process.env.MAIL_USER}>`,
      to: userEmail,
      subject: 'Export CSV des films',
      text: 'Veuillez trouver ci-joint le fichier CSV des films demandés.',
      attachments: [
        {
          filename: path.basename(filePath),
          path: filePath,
        },
      ],
    };

    return transporter.sendMail(mailOptions);
  }
}

module.exports = CsvExportService;
