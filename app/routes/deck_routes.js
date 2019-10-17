// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for decks
const Deck = require('../models/deck')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { deck: { title: '', text: 'foo' } } -> { deck: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /decks
router.get('/decks', requireToken, (req, res, next) => {
  Deck.find()
    .then(decks => {
      // `decks` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return decks.map(deck => deck.toObject())
    })
    // respond with status 200 and JSON of the decks
    .then(decks => res.status(200).json({ decks: decks }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /decks/5a7db6c74d55bc51bdf39793
router.get('/decks/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Deck.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "deck" JSON
    .then(deck => res.status(200).json({ deck: deck.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /decks
router.post('/decks', requireToken, (req, res, next) => {
  // set owner of new deck to be current user
  req.body.deck.owner = req.user.id

  Deck.create(req.body.deck)
    // respond to succesful `create` with status 201 and JSON of new "deck"
    .then(deck => {
      res.status(201).json({ deck: deck.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /decks/5a7db6c74d55bc51bdf39793
router.patch('/decks/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.deck.owner

  Deck.findById(req.params.id)
    .then(handle404)
    .then(deck => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, deck)

      // pass the result of Mongoose's `.update` to the next `.then`
      return deck.updateOne(req.body.deck)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /decks/5a7db6c74d55bc51bdf39793
router.delete('/decks/:id', requireToken, (req, res, next) => {
  Deck.findById(req.params.id)
    .then(handle404)
    .then(deck => {
      // throw an error if current user doesn't own `deck`
      requireOwnership(req, deck)
      // delete the deck ONLY IF the above didn't throw
      deck.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
