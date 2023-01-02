const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: './photoHolder'});
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser());

cloudinary.config({
  cloud_name: "dn9heevps",
  api_key: process.env.PHOTO_API_KEY,
  api_secret: process.env.PHOTO_API_SECRET
});


const PATH = 3000;
const baseURL = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';
const getOptions =
{
  method: 'GET',
  headers: {
    'Authorization': process.env.GITHUB_ACCESS_TOKEN
  }
};

const putOptions = {
  method: 'PUT',
  headers: {
    'Authorization': process.env.GITHUB_ACCESS_TOKEN
  }
};


// API ROUTES
app.get('/products', (req, res) => {
  fetch(`${baseURL}/products`, getOptions)
    .then(results => {
      return results.json();
    })
    .then(results => {
      res.send(results);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/products/:query(*)', (req, res) => {
  fetch(`${baseURL}/products/${req.params.query}`, getOptions)
    .then(results => {
      return results.json();
    })
    .then(results => {
      res.send(results);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/reviews', (req, res) => {
  fetch(`${baseURL}/reviews/?` + new URLSearchParams({
    'product_id': req.query.product_id,
    sort: req.query.sort,
    page: req.query.page,
    count: req.query.count,
  }), getOptions)
    .then(results => {
      return results.json();
    })
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});

app.get('/reviews/meta', (req, res) => {
  fetch(`${baseURL}/reviews/meta/?product_id=${req.query.product_id}`, getOptions)
    .then(results => {
      return results.json();
    })
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// Increment review helpfulness
app.put('/reviews/helpful/', (req, res) => {
  fetch(`${baseURL}/reviews/${req.query.review_id}/helpful`, putOptions)
    .then((data) => {
      res.status(200).send(true);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//report a review
app.put('/reviews/report/', (req, res) => {
  fetch(`${baseURL}/reviews/${req.query.review_id}/report`, putOptions)
    .then((data) => {
      res.status(200).send(true);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});
// Adds user review to the database


app.post('/reviews/userReview/', (req, res) => {
  const postOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Authorization': process.env.GITHUB_ACCESS_TOKEN,
    },
    body: JSON.stringify(req.body)
  };
  fetch(`${baseURL}/reviews/`, postOptions)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post('/reviews/photoUpload', upload.any(), (req, res) => {
  console.log(req.files);
  fs.readFile(req.files[1].path, (error1, prefixData) => {
    let prefix = prefixData.toString();
    fs.readFile(req.files[0].path, (error2, photoData) => {
      let theData = photoData.toString('base64');
      let finalData = `${prefix},${theData}`;
      fs.writeFile(`${req.files[0].path}-base64`, finalData, (error3) => {
        if (error3) {
          console.log(error3);
        } else {
          //${req.files[0].path}-base64
          cloudinary.uploader.upload(`${req.files[0].path}`, {public_id: req.files[0].filename})
            .then((data) => {
              console.log('it worked: ', data);
            })
            .catch(err => {
              console.log('There was an error: ', err);
            });
        }
      });
    });
  // fs.readFile(req.file.path, (err, data) => {
  //   let theData = data.toString('base64');
  //   fs.writeFile(`${req.file.path}-base64`, theData, (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       cloudinary.uploader.upload('/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/rpp2207-fec/photoHolder/2b5330550e703a1a91b0e8f6eefa3ae2-base64', {public_id: req.file.filename})
  //         .then((data) => {
  //           console.log('it worked: ', data);
  //         })
  //         .catch(err => {
  //           console.log('There was an error: ', err);
  //         });
  });
});
// GET Questions
app.get('/qa/questions/:id', (req, res) => {
  var id = `product_id=${req.params.id}`;

  fetch(`${baseURL}/qa/questions?${id}`, getOptions)
    .then(results => {
      return results.json();
    })
    .then(results => {
      res.status(200);
      res.send(results);
    })
    .catch(err => {
      res.status(400);
      res.send(err);
    });
});

// GET Answers
app.get('/qa/answers/:id', (req, res) => {
  var id = req.params.id;

  fetch(`${baseURL}/qa/questions/${id}/answers`, getOptions)
    .then(results => {
      return results.json();
    })
    .then(results => {
      res.status(200);
      res.send(results);
    })
    .catch(err => {
      res.status(400);
      res.send(err);
    });
});

// POST Questions
app.post('/qa/questions', (req, res) => {
  var options = {
    method: 'POST',
    body: req.body,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  fetch(`${baseURL}/qa/questions`, options)
    .then(results => {
      console.log(results);
      res.sendStatus(201);
    })
    .catch(err => {
      res.status(401);
      res.send(err);
    });
});

// POST Answers
app.post('/qa/answers/:id', (req, res) => {
  var options = {
    method: 'POST',
    body: req.body,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  fetch(`${baseURL}/qa/questions/${req.params.id}/answers`, options)
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      res.status(401);
      res.send(err);
    });
});

// Report or Mark as Helpful
app.put('/qa/:type/:id/:action', (req, res) => {
  var options = {
    method: 'PUT',
    headers: {
      'Authorization': process.env.GITHUB_ACCESS_TOKEN
    }
  };
  var type = req.params.type;
  var action = req.params.action;
  var id = req.params.id;

  fetch(`${baseURL}/qa/${type}/${id}/${action}`, options)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      res.status(404);
      res.send(err);
    });
});


// PRODUCT ID ROUTE
app.get('/:id', (req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, '..', 'client', 'dist')});
});

app.listen(PATH, () => {
  console.log(`Server listening to port: ${PATH}`);
});