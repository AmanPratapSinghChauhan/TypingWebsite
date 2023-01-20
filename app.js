
const express =require('express');
const bodyparser=require('body-parser');
const app=express();
const mongoose=require('mongoose');
const ejs=require('ejs');
const React=require('react');
const ReactDOM=require('react-dom');
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
var currentUser='';
const options = {
useNewUrlParser: true,
useUnifiedTopology: true,
serverSelectionTimeoutMS: 5000,
autoIndex: false, // Don't build indexes
maxPoolSize: 10, // Maintain up to 10 socket connections
serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
family: 4 // Use IPv4, skip trying IPv6
}
mongoose.connect('mongodb://localhost:27017/typingData',options);
const typingSchema={
  username:String,
  password:String,
};

const Typer=new mongoose.model('typer',typingSchema);
const userSchema={
  name:String,
  userspeed:String
};
const User=new mongoose.model('user',userSchema);
app.get('/history',function(req,res){
  // Typer.findOne({username:currentUser},function(err,found){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
      // console.log(found.speeds);
      // const id=found.speeds;
      // console.log(id);
      User.find({name:currentUser},function(err,foundm){
        if(err){
          console.log(err);
        }
        else{
          console.log(foundm);
          res.render('history',{data:foundm});
          console.log(foundm[0].userspeed);
          console.log(currentUser);

        }
      })
    // }
  })
// })


app.get('/',function(req,res){
  // res.sendFile(__dirname+'/index.html');

  res.render('index',{userName:currentUser});

})
app.post('/',function(req,res){
  console.log('hello world');
  console.log(req.body.hidden);
  console.log(currentUser);
  if(currentUser==''){
    res.render('index',{userName:''});
  }
  else{
    const newuser=new User({
      name:currentUser,
      userspeed:req.body.hidden
    });
    newuser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log('sucess');
        res.render('index',{userName:currentUser});
      }
    })
    // Typer.findOne({username:currentUser},function(err,foundONe){
    //   if(err){
    //     console.log(err);
    //   }
    //   else{
    //       newspeed.save();
    //     foundONe.speeds.push(newspeed);
    //     foundONe.save();
    //     console.log('successful');
    //     res.render('index',{userName:currentUser});
    //   }
    //
    // })
  }


});
app.get('/register',function(req,res){
  res.render('register');
})
app.get('/login',function(req,res){
  res.render('login');
})
app.post('/register',function(req,res){
  const newuser = new Typer({
    username:req.body.username,
    password:req.body.password
  });
  newuser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render('index',{userName:newuser.username});
      currentUser=newuser.username;

    }
  })
});
app.post('/login',function(req,res){
  const newUser=req.body.username;
  const newPassword=req.body.password;
  Typer.findOne({username:newUser},function(err,foundOne){
    if(err){
      console.log('wrong password');
      console.log(err);
    }
    else{
      if(foundOne.password==newPassword){
        res.render('index',{userName:newUser})
        currentUser=newUser;
        console.log(foundOne);
      }
      else{
        res.redirect('/login');
      }
    }
  })
})





app.listen(3000,function(){
  console.log("server starts on port 3000");
})
