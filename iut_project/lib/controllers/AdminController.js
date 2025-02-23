// Extrait du fichier AdminController.js
const Boom = require('@hapi/boom');
const { Service } = require('@hapipal/schmervice');
const RabbitMQService = require('../services/RabbitMQService');  // <-- Import du RabbitMQService

module.exports = class AdminController extends Service {
  async requestCsvExport(request, h) {
    const user = request.auth.credentials;
    if (!user || (!user.role !== 'admin')) {
      throw Boom.forbidden('Vous devez être un administrateur pour accéder à cette fonctionnalité');
    }

    try {
      const movieData = await Movie.query();
      const message = {
        type: 'CSV_EXPORT_REQUEST',
        userEmail: user.email,
        movies: movieData,
      };

      await RabbitMQService.sendMessage('csv-export-queue', message);
      return h.response({ message: 'La demande d\'export CSV a été envoyée. Vous recevrez un email lorsque le fichier sera prêt.' }).code(202);
    } catch (error) {
      throw Boom.internal('Erreur lors de l\'envoi de la demande d\'export', error);
    }
  }
};
