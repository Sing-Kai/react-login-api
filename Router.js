const bcrypt = require('bcrypt');

class Router{

    constructor(app, db){
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
    }

    login(app, db){

        app.post('/login', (req, res)=> {

            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();

            //validate user request
            if(username.length > 12 || password.length > 12){
                req.json({
                    success: false,
                    msg: 'An errors occured, please try again'
                })

                return;
            }
           
            let cols = [username];

            //check if user is found in db
            db.query('SELECT * FROM user WHERE username = ? LIMIT 1', cols, (err, data, fields) =>{

                //return error to user
                if(err){

                    res.json({
                        success:false,
                        msg: 'An errors occured, please try again'
                    })
                    return;
                }

                //check db return data is valid
                if(data && data.length === 1){
                    
                    //verify user password with stored password
                    bcrypt.compare(password, data[0].password, (bcryptErr, verified)=>{

                        if(verified){

                            console.log("verified user");

                            req.session.userID = data[0].id;
                            res.json({
                                success: true,
                                username: data[0].username
                            })
                            return;
                        }else{

                            console.log("invalid password");

                            res.json({
                                success: false,
                                msg: 'Invalid password'
                            })
                        }

                    });

                }else{

                    res.json({
                        success:false,
                        msg: 'User is not found'
                    })

                }

            });

        });

    }

    logout(app, db){

        app.post('/logout', (req, res) =>{

            if(req.session.userID){

                console.log("logging out user");

                req.session.destroy();
                res.json({
                    success: true
                })

                return true;
            }else{
                res.json({
                    success: false
                })
                return false;
            }

        })

    }

    isLoggedIn(app, db){
        app.post('/isLoggedIn', (req, res) =>{

            if(req.session.userID){

                let cols = [req.session.userID];
                
                db.query('SELECT * FROM user WHERE id = ? LIMIT 1', cols, (err, data, fields) =>{

                    if(data && data.length === 1){

                        console.log("found data, user is logged in");

                        res.json({
                            success: true,
                            username: data[0].username
                        });

                        return true;
                    }else{

                        console.log("can not find data user login data");

                        res.json({
                            success: false
                        })
                    }
                });

            }
            else{
                res.json({
                    success: false
                })
            }

        });
    }
}


module.exports = Router;