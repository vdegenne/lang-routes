const Koa = require('koa')
const Router = require('koa-router')
const statics = require('koa-static')
const bodyParser = require('koa-body')
const { writeFileSync, readFileSync, existsSync } = require('fs')

const app = new Koa
const router = new Router


app.use(statics('public'))
app.use(bodyParser())

router.get('/data', function (ctx) {
  let data
  if (existsSync('data.json')) {
    data = readFileSync('data.json')
  }
  else {
    data = []
  }
  ctx.body = data
})

router.put('/data', function (ctx) {
  writeFileSync('data.json', JSON.stringify(ctx.request.body))
  ctx.body = ''
})

app.use(router.routes()).use(router.allowedMethods())

const port = 8456
app.listen(port, function () {
  console.log(`http://localhost:${port}`)
})