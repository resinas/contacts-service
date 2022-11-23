var express = require('express');
var router = express.Router();
var fakesocial = require('../services/fakeservice');
var Contact = require('../models/contact');
var debug = require('debug')('contacts-2:server');

/* GET contacts listing. */
router.get('/', async function(req, res, next) {
  try {
    const result = await Contact.find();
    res.send(result.map((c) => c.cleanup()));
  } catch(e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* POST contact */
router.post('/', async function(req, res, next) {
  const {name, phone} = req.body;

  const contact = new Contact({
    name, 
    phone
  });

  try {
    await contact.save();
    return res.sendStatus(201);
  } catch(e) {
    if (e.errors) {
      debug("Validation problem when saving");
      res.status(400).send({error: e.message});
    } else {
      debug("DB problem", e);
      res.sendStatus(500);
    }
  }
});

/* GET contact/id */
router.get('/:name', async function(req, res, next) {
  var name = req.params.name;
  var result = contacts.find(c => {
    return c.name === name;
  });
  var social = await fakesocial.getSocial(name);

  if (result) {
    res.send({
      ...result,
      "social": social
    });
  } else {
    res.sendStatus(404);
  }
})

module.exports = router;
