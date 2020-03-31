'use strict';

// const dialogflow = require('dialogflow');
// const localStorage = require('local-storage');

const axios = require('axios');
const moment = require('moment');
const express = require('express');
const settings = require('../settings');
const router = express.Router();
const {WebhookClient} = require('dialogflow-fulfillment');

const utils = require('./utils');

router.get('/', (req, res, next) => {
  res.render('index');
  // res.send(`Server is up and running.`);
});

router.post('/webhook', (req, res, next) => {

  // console.log('Dialogflow Request headers : ' + JSON.stringify(req.headers));
  // console.log('Dialogflow Request body : ' + JSON.stringify(req.body));

  // const request_source = req.body.queryResult.outputContexts;
  // const request_user = request_source[1].parameters.user;
  // console.log(`\nUser : ${request_user}\n`);

  const agent = new WebhookClient({request: req, response: res});

  const {locale} = agent;

  function check(agent) {
    let {session, query} = agent;
    let payload = {
      query: query,
      session: session.toString().split('/').pop(),
      languageCode: locale
    };
    return utils.check(payload)
      .then(res => {
        const {queryText, fulfillmentText} = res[0].queryResult;
        const reply = {
          query: queryText,
          response: fulfillmentText,
        };
        console.log(`Reply: `, reply);
        // agent.context.set({
        //   'name': 'CheckWeather-followup',
        //   'lifespan': 1,
        // });
        return agent.add(reply.response);
      })
      .catch(err => {
        console.log(`error: `, err);
        return agent.end(`looks like its clear ☁`);
      });
  }

  let intentMap = new Map();
  intentMap.set('Intent', intent);
  agent.handleRequest(intentMap);

});

module.exports = router;
