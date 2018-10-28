'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return {
    greeting: 'Hello world in JSON'
  }
})

Route.get('/post', () => {
  return {
    text: 'hello world'
  }
})

Route.post('/signup', 'UserController.signup')

Route.post('/login', 'UserController.login')

// Route.group(() => {
//   Route.get('/me', 'UserController.me')
//   Route.put('/update_profile', 'UserController.updateProfil')
// }).prefix('account').middleware(['auth:jwt'])
Route.get('/me', 'UserController.me')
