'use strict';

const nodemailer = require('nodemailer');
const Boom = require('@hapi/boom');
const { Service } = require('@hapipal/schmervice');
require('dotenv').config();

module.exports = class MailService extends Service {
  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }

  async sendEmail(toEmail, subject, text, html) {
    const mailOptions = {
      from: `"IPTV" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: subject,
      text: text,
      html: html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé :', info.messageId);
    } catch (error) {
      console.error('Erreur lors de l’envoi de l’email :', error);
    }
  }

  async sendWelcomeEmail(toEmail, firstName) {
    const subject = 'Bienvenue sur IPTV !';
    const text = `Bonjour ${firstName},\n\nBienvenue sur notre plateforme !\n\nÀ bientôt,\nL'équipe d'IPTV`;
    const html = `<p>Bonjour <strong>${firstName}</strong>,</p><p>Bienvenue sur notre plateforme !</p><p>À bientôt,<br>L'équipe d'IPTV</p>`;

    await this.sendEmail(toEmail, subject, text, html);
  }

  async notifyNewMovie(users, movieTitle) {
    const subject = `Nouveau film ajouté : ${movieTitle}`;
    const text = `Un nouveau film "${movieTitle}" vient d'être ajouté à notre collection !`;
    const html = `<p>Un nouveau film <strong>"${movieTitle}"</strong> vient d'être ajouté à notre collection !</p>`;

    for (const user of users) {
      await this.sendEmail(user.email, subject, text, html);
    }
  }

  async notifyMovieUpdate(users, movieTitle) {
    const subject = `Mise à jour du film : ${movieTitle}`;
    const text = `Le film "${movieTitle}" que vous avez en favoris a été mis à jour.`;
    const html = `<p>Le film <strong>"${movieTitle}"</strong> que vous avez en favoris a été mis à jour.</p>`;

    for (const user of users) {
      await this.sendEmail(user.email, subject, text, html);
    }
  }
};
