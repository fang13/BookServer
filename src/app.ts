import * as express from "express"

let router = express();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', new Date().toLocaleString());
  next()
})

router.get('/', function (req, res) {
  res.send('Home Page')
})

router.listen(8080, () => {
  console.log("开启服务");
});