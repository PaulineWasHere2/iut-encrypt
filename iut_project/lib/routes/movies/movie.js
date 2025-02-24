'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');
const { sendMail } = require('../../services/emailService');

module.exports = [
  {
    method: 'GET',
    path: '/movies',
    options: {
      auth: { scope: ['user', 'admin'] },
      description: 'Liste des films disponibles',
      handler: async (request, h) => {
        const { Movie } = request.models();
        return await Movie.query();
      }
    }
  },

  {
    method: 'GET',
    path: '/movies/{id}',
    options: {
      auth: { scope: ['user', 'admin'] },
      description: 'Récupérer un film par ID',
      validate: {
        params: Joi.object({ id: Joi.number().integer().required() })
      },
      handler: async (request, h) => {
        const { Movie } = request.models();
        const movie = await Movie.query().findById(request.params.id);

        if (!movie) throw Boom.notFound('Film introuvable');
        return movie;
      }
    }
  },
  {
    method: 'POST',
    path: '/movies',
    options: {
      auth: { scope: ['admin'] },
      description: 'Ajouter un film (admin uniquement)',
      validate: {
        payload: Joi.object({
          title: Joi.string().min(1).required(),
          description: Joi.string().min(10).required(),
          release_date: Joi.date().required(),
          director: Joi.string().min(3).required()
        })
      },
      handler: async (request, h) => {
        const { Movie } = request.models();
        const newMovie = await Movie.query().insertAndFetch({
          ...request.payload,
          created_at: new Date(),
          updated_at: new Date()
        });

        const { mailService } = request.services();
        const { User } = request.models()

        const users = await User.query();
        const emailList = users.map(user => user.email);

        try {
          await mailService.notifyNewMovie(users, newMovie.title);

          return h.response(newMovie).code(201);
        } catch (error) {
          Boom.badRequest('Erreur lors de la création du film.')
          return h.response(error).code(500);
        }
      }
    }
  },

  {
    method: 'PUT',
    path: '/movies/{id}',
    options: {
      auth: { scope: ['admin'] },
      description: 'Modifier un film (admin uniquement)',
      validate: {
        params: Joi.object({ id: Joi.number().integer().required() }),
        payload: Joi.object({
          title: Joi.string().min(1).optional(),
          description: Joi.string().min(10).optional(),
          release_date: Joi.date().optional(),
          director: Joi.string().min(3).optional()
        })
      },
      handler: async (request, h) => {
        const { Movie } = request.models();
        const updatedMovie = await Movie.query()
          .patchAndFetchById(request.params.id, {
            ...request.payload,
            updated_at: new Date()
          });

        const { Favorite, User } = request.models();

        const favorites = await Favorite.query()
          .where({ movie_id: request.params.id })
          .withGraphFetched('user');

        const users = await User.query();
        await mailService.notifyMovieUpdate(users, newMovie.title);

        if (!updatedMovie) throw Boom.notFound('Film introuvable');
        return updatedMovie;
      }
    }
  },
  {
    method: 'DELETE',
    path: '/movies/{id}',
    options: {
      auth: { scope: ['admin'] },
      description: 'Supprimer un film (admin uniquement)',
      validate: {
        params: Joi.object({ id: Joi.number().integer().required() })
      },
      handler: async (request, h) => {
        const { Movie } = request.models();
        const deletedRows = await Movie.query().deleteById(request.params.id);

        if (!deletedRows) throw Boom.notFound('Film introuvable');
        return h.response().code(204);
      }
    }
  },
  {
    method: 'POST',
    path: '/favorites/{movieId}',
    options: {
      auth: { scope: ['user'] },
      description: 'Ajouter un film aux favoris',
      validate: {
        params: Joi.object({ movieId: Joi.number().integer().required() })
      },
      handler: async (request, h) => {
        const { Favorite } = request.models();
        const userId = request.auth.credentials.id;
        const movieId = request.params.movieId;

        const existingFav = await Favorite.query().findOne({ user_id: userId, movie_id: movieId });
        if (existingFav) throw Boom.badRequest('Le film est déjà dans vos favoris');

        await Favorite.query().insert({ user_id: userId, movie_id: movieId });

        return h.response({ message: 'Film ajouté aux favoris' }).code(201);
      }
    }
  },
  {
    method: 'DELETE',
    path: '/favorites/{movieId}',
    options: {
      auth: { scope: ['user'] },
      description: 'Supprimer un film des favoris',
      validate: {
        params: Joi.object({ movieId: Joi.number().integer().required() })
      },
      handler: async (request, h) => {
        const { Favorite } = request.models();
        const userId = request.auth.credentials.id;
        const movieId = request.params.movieId;

        const existingFav = await Favorite.query().findOne({ user_id: userId, movie_id: movieId });
        if (!existingFav) throw Boom.badRequest('Le film n\'est pas dans vos favoris');

        await Favorite.query().delete().where({ user_id: userId, movie_id: movieId });

        return h.response({ message: 'Film supprimé des favoris' }).code(200);
      }
    }
  },
  {
    method: 'GET',
    path: '/favorites',
    options: {
      auth: { scope: ['user'] },
      description: 'Voir les films favoris',
      handler: async (request, h) => {
        const { Favorite, Movie } = request.models();
        const userId = request.auth.credentials.id;

        const favorites = await Favorite.query().where({ user_id: userId }).withGraphFetched('movie');
        return favorites.map(fav => fav.movie);
      }
    }
  },
  {
    method: 'POST',
    path: '/movies/export',
    options: {
      auth: { scope: ['admin'] },
      description: 'Demander l\'export des films en CSV et envoi par message broker (admin uniquement)',
      handler: async (request, h) => {
        const { adminController } = request.services();
        return await adminController.requestCsvExport(request, h);
      }
    }
  }
];
