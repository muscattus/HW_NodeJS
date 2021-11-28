const express = require('express');
const router = express.Router();
const log = require(INCPATH + "/log")(module); //log is a function. which is called with the current model to which
const fs = require("fs");
const { body, validationResult } = require('express-validator');


let list;

fs.readFile("./config/articles.json", "utf8", function(err, data) {
  if (err) {
    return console.log(err);
  }
  list = data;
  list = JSON.parse(list);
});


router.get("/articles", function(req, res) {
    log.info("==Get all list articles==");
    res.end(JSON.stringify(list));
  });

  router.get("/articles/:id", function(req, res) {
    log.info("==Get article by id==");
    const articleById = list.find(article => +article.id === +req.params.id);
    if (!articleById) {
        return res.status(404).json({error: 'Article not found'});
    }
    res.end(JSON.stringify(articleById));
});

router.post("/articles", [
    body('title').exists()
    .withMessage('Is missing'),
    body('description').exists()
    .withMessage('Is missing')
], function(req, res) {
    const errors = {errors: validationResult(req).array()};
    
    if (!validationResult(req).isEmpty()) {
        return sendError(errors, res);
    } 
    log.info("==Save article==");
    const article = req.body;
    article.id = getMaxId(list) + 1;
    list.push(article);
    fs.writeFile('./config/articles.json', JSON.stringify(list), (err) => console.log(err));
    res.end(JSON.stringify(list));
});
  
router.delete("/articles/:id", function (req, res) {
      log.info('==Delete article by id==');
      const articleById = list.findIndex(article => +article.id === +req.params.id);
      if (articleById < 0) {
        return res.status(404).json({error: 'Article not found'});
        }
      list.splice(articleById, 1);
      res.end(JSON.stringify(list));
});
router.delete("/articles/", function (req, res) {
      log.info('==Delete all articles==');
      list = [];
      fs.writeFile('./config/articles.json', JSON.stringify(list), (err) => console.log(err));
      res.end(JSON.stringify(list));
});

router.patch("/articles/:id",  [
    body('description').exists()
                .withMessage('Is missing')
], function(req, res) {
    const errors = {errors: validationResult(req).array()};
    if (!validationResult(req).isEmpty()) {
        return sendError(errors, res);
    } 
    log.info('==Update article by id==');
    const articleDescription = req.body.description;
    const articleById = list.find(article => +article.id === +req.params.id);
    if (!articleById) {
        return res.status(404).json({error: 'Article not found'});
    }
    articleById.description = articleDescription;
    fs.writeFile('./config/articles.json', JSON.stringify(list), (err) => console.log(err));
    res.send(JSON.stringify(list));
})


function sendError(errors, res) {
    log.info("==Invalid parameters, cannot save==");
    const responseErrors = [];
    for (err of errors.errors) {
        responseErrors.push({[err.param] : err.msg})
    };
    return res.send(responseErrors);
}

function getMaxId(list) {
    let ids = [];
    if(list.length === 0){
        return 0;
    }
    for (let i = 0; i < list.length; i++){
        ids.push(parseInt(list[i].id));
    }
    return Math.max(...ids);
}

module.exports = router;