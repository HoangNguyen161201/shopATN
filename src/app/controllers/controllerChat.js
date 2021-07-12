const checkAccount = require("../helpers/checkAccount");
const modelChat = require("../models/modelChat");
class chat {

    async show(req, res) {
        await modelChat.find().sort({_id:-1}).limit(30).sort({_id:1}).then( e => {
            var messages = e.map(es => es.toObject());
            var account = checkAccount.checkAccount(req.cookies);
            messages.forEach(value=>{
                value.checkid = account[1][1];
            })
           console.log(messages);
            console.log(account);
            res.render('chat', {
                nameAccount: account[1][0],
                id: account[1][1],
                messages
            });
        })

    }
}
module.exports = new chat;