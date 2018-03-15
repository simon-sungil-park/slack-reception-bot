const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();
const WebSocket = require('ws');
const Slack = require('slack');
const bodyParser = require('body-parser');

//process.env.SLACK_BOT_TOKEN='xoxb-329163495858-0j4BiBV7v3XEdfoJV5u238YG';
const token = process.env.SLACK_BOT_TOKEN

const slackBot = new Slack({token})


app.use(bodyParser.json());

app.get('/bot/users/', (req, res) => {
  slackBot.users.list()
    .then(result => {
      res.json({
        ok: true, 
        users: result.members
          .map(user => {
            return {
              id: user.id,
              name: user.real_name,
              first_name: user.profile.first_name,
              last_name: user.profile.last_name,
              image_url: user.profile.image_512,
              is_bot: user.is_bot
            }
          })
          .filter(user => ( !user.is_bot && user.id !== 'USLACKBOT' ))
      })
    })
    .catch(err => {
      res.statusCode(500).json({ok: false, msg: 'Internal Error'});
    })
})

app.post('/bot/messages/', (req, res) => {

  const { user_id, message } = req.body;

  slackBot.im.open({user: user_id})
    .then( result => {
      return slackBot.chat.postMessage({channel:result.channel.id, text:message});
    })
    .then( result => {
      res.json({ok: true});
    })
    .catch( err => {
      res.statusCode(500).json({ok: false, msg: 'Internal Error'});
    })
})

// start server
app.listen(port, function (req, res) {
    console.log(`Started Express server on port ${port}`);
});





// function slackNpm() {

   
  // :new: opt into promises
  //Slack.api.test({nice:1}).then(console.log).catch(console.log)


 
  // logs {args:{hyper:'card'}}
  //bot.api.test({hyper:'card'}).then(console.log)

  // bot.api.test()
  //   .then(result => {
  //     console.log(result);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })


  // bot.apps.permissions.info()
  //   .then(result => {
  //     console.log(result);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })

  //   bot.users.list()
  //   .then(result => {
  //     console.log(result);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })

  // bot.rtm.connect()
  //   .then(result => {
  //     console.log('rtm.connect', result);
  //   })
  //   .catch(err => {
  //     console.log('rtm.connect',err);
  //   })

//     bot.rtm.start()
//     .then(result => {
//       console.log('rtm.start', result);

//       const ws = new WebSocket(result.url);
       
//       ws.on('open', function open() {
//         console.log('open');
    
//         bot.im.open({user: 'U9P1FGUQK'})
//           .then( result => {
//             console.log(result);
//             bot.chat.postMessage({channel:result.channel.id, text:'Good Afternoon!'});
//           })
        

//       });

//       ws.on('close', function close() {
//         console.log('close');
//       });
      
//       ws.on('message', function incoming(data) {
//         console.log('message', data);
//       });

//     })
//     .catch(err => {
//       console.log('rtm.start', err);
//     })
// }
