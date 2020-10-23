const express = require('express');
const conn = require('./sqlConnection');
const usertransformer = require('./userTransformer');
const config = require('./config');

const app = new express();

function attachConn(req,res,next){
    req.connection = conn;
    next();
}

app.use('*',attachConn);
app.get('/user',async function(req,res){
    const result = await new Promise(function(resolve,reject){req.connection.query(`SELECT * from user where id = ${req.query.id}`, function (error, results, fields) {
        if (error) throw error;
         resolve(results);
      })});
      const user = usertransformer.transformUser(result[0]);
      if(user){
        res.status(400).send('INVALID USER ID');
      }
      else{
        res.send(user);
      }
})


app.get('/friends',async function(req,res){
    const result = await new Promise(function(resolve,reject){req.connection.query(`select * from user_friends_map uf
    inner join user u on u.id = uf.friend_user_id where uf.user_id= ${req.query.user_id} and status = ${config.IS_FRIEND}`, function (error, results, fields) {
        if (error) reject(error);
         resolve(results);
      })});
    const friends = result.map(x=>usertransformer.transformUser(x))
      res.send(friends);
})


app.get('/friend-of-friend', async function(req,res){
    const result = await new Promise(function(resolve,reject){
        req.connection.query(`select * from user_friends_map uf inner join user u on u.id = uf.user_id where uf.user_id in (
            select friend_user_id from user_friends_map where user_id =
            ${req.query.user_id} and status =1) and friend_user_id <> ${req.query.user_id}`, function (error, results, fields) {
                if (error) reject(error);
                 resolve(results);
              });
    });
    const FOF = result.map(x=>usertransformer.transformFriendofFriend(x))
    res.send(FOF);
})


app.listen(8000,function(err,res){
    if(err){
        throw err;
    }
    console.log('Listening on port 8000');
});