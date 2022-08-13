var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./post')
const passport = require('passport');
const localStrategy = require('passport-local')
const multer = require('multer')
const fsex = require('fs-extra')



// store the file in the images/uplods directory and create a unique filename for each
const storagedata = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    // console.log(file);
    const unique = Date.now() + 'jeetul' + Math.floor(Math.random() * 100000) + `${file.originalname}`
    cb(null, unique)
  }
})



// filter the file before upload
function fileFilter(req, file, cb) {
  if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif' || file.mimetype == 'video/x-flv' || file.mimetype == "video/mp4" || file.mimetype == "video/webm") {
    cb(null, true)
  } else {
    cb(null, false)
    cb(new Error('I don\'t have a clue!'))
  }
}



const upload = multer({
  storage: storagedata,
  fileFilter: fileFilter,
})

/**
 * A passport strategy that uses the local strategy to authenticate a user.           
 * @param {UserModel} UserModel - The user model to use for authentication.           
 * @returns None           
 */
passport.use(new localStrategy(userModel.authenticate()))



/**
 * Renders the index page.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.get('/', function (req, res) {
  res.render('index')
});


// router.get('/new', function (req, res) {
//   res.render('loginnn')
// })

/**
 * Renders the profile page for the user.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.get('/profile', isLoggedIn, function (req, res) {
  userModel.findOne({
      username: req.session.passport.user,
    })
    .populate('posts')
    .then(function (data) {
      res.render('profile', {
        data
      })
      // res.json(data)
      // res.send(data);
    })
})

// 
// router.get('/profilee', isLoggedIn, function (req, res) {
//   userModel.findOne({
//       username: req.session.passport.user,
//     })
//     .populate('posts')
//     .then(function (data) {
//       // res.render('profile', {
//       //   data
//       // })
//       res.json(data)
//       // res.send(data);
//     })
// })



/**
 * A route that allows the user to like a post.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.get("/like/:id", isLoggedIn, function (req, res) {
  userModel.findOne({
    username: req.session.passport.user,
  }).then(function (founduser) {
    postModel.findOne({
      _id: req.params.id,
    }).then(function (foundpost) {
      if (foundpost.likes.indexOf(founduser._id) === -1) {
        foundpost.likes.push(founduser._id)
      } else {
        var agaresistkartahaitoh = foundpost.likes.indexOf(founduser._id);
        foundpost.likes.splice(agaresistkartahaitoh, 1);
      }
      foundpost.save().then(function (liked) {
        res.redirect(req.headers.referer)
        // res.json(foundpost);
        // console.log(foundpost.likes.length);

      })
    })
  })
})



/**
 * Deletes a post from the database.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
// router.get('/delete/:plc', isLoggedIn, function (req, res) {
//   postModel.findOneAndDelete({
//     _id: req.params.plc
//   }).then(function (deleted) {
//     console.log(deleted.imgpost.split('/')[3]);
//     fsex.remove(`./public/images/uploads/${deleted.imgpost.split('/')[3]}`, err => {
//       if (err) res.send(err);
//       else console.log('done deleting the file');
//     })
//     // res.redirect('/profile')
//     res.json(deleted)
//   })
// })


router.get('/delete/:plc', isLoggedIn, function (req, res) {
  postModel.findOneAndDelete({
    _id: req.params.plc
  }).then(function (deleted) {
    console.log(deleted.imgpost.split('/')[3]);
    fsex.remove(`./public/images/uploads/${deleted.imgpost.split('/')[3]}`, err => {
      if (err) res.send(err);
      else console.log('done deleting the file');
    })
    res.redirect('/profile')
  })
})


/**
 * Renders the login page.       
 * @param {Request} req - the request object       
 * @param {Response} res - the response object       
 * @returns None       
 */
router.get('/loginn', function (req, res) {
  res.render('loginn')
})


/**
 * A route that allows a user to post a new post.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.post('/post', isLoggedIn, upload.single('imgpost'), function (req, res) {
  userModel.findOne({
    username: req.session.passport.user
  }).then(function (loggedinuser) {
    postModel.create({
      post: req.body.post,
      userid: loggedinuser._id,
      imgpost: `./images/uploads/${req.file.filename}`
    }).then(function (response) {
      loggedinuser.posts.push(response._id);
      loggedinuser.save().then(function (response) {
        res.redirect("/profile")
      })
    })
  })
})


/**
 * Renders the feed page.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.get('/feed', isLoggedIn, function (req, res) {
  userModel.findOne({
    username: req.session.passport.user
  }).then(function (user) {
    postModel.find().populate("userid").then(function (allposts) {
      // res.render('feed', {
      //   user,
      //   allposts
      // })
      res.send(allposts)
      // console.log(user);
      // console.log(allposts);
    })
  })
})



/**
 * Adds a comment to the post with the given postid.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.post('/comment/:postid', isLoggedIn, async function (req, res) {
  let loggedinuser = await userModel.findOne({
    username: req.session.passport.user
  })
  let foundpost = await postModel.findOne({
    _id: req.params.postid
  })
  foundpost.comments.push({
    username: loggedinuser.username,
    name: loggedinuser.name,
    comment: req.body.comment
  })
  await foundpost.save()
  res.redirect(req.headers.referer)

})


// upload a image file as avatar
router.post('/upload', isLoggedIn, upload.single('uploadimg'), function (req, res) {
  userModel.findOne({
    username: req.session.passport.user
  }).then(function (userfound) {
    userfound.img = `./images/uploads/${req.file.filename}`
    userfound.save()
    res.redirect(req.headers.referer)
  })
})


router.post('/postimgarr', isLoggedIn, upload.array('uploaddata'), function (req, res) {
  req.file
  res.send('page soon to be ')
})





/**
 * Registers a new user.           
 * @param {userModel} newuserModel - the userModel object to register.           
 * @param {string} password - the password to register the user with.           
 * @returns None           
 */
router.post('/register', function (req, res, next) {
  var newuserModel = new userModel({
    username: req.body.username,
    name: req.body.name
  })
  userModel.register(newuserModel, req.body.password)
    .then(function (u) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile')
        // res.send(u)

      })
    })
    .catch(function (err) {
      res.send(err)
    })
})


/**
 * A route that handles the login process.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}), function (req, res) {});



/**
 * Logs the user out and redirects them to the login page.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @param {NextFunction} next - The next function.           
 * @returns None           
 */
router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect('/loginn')
})



/**
 * A middleware function that checks if the user is logged in.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @param {Function} next - The next middleware function.           
 * @returns None           
 */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/')
  }
}


module.exports = router;