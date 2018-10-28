"use strict";

const User = use("App/Models/User");

class UserController {
  async signup({
    request,
    response,
    auth
  }) {
    const userData = request.only(["username", "password", "email"]);
    try {
      const user = await User.create(userData);
      const token = await auth.generate(user);
      return response.json({
        status: "succes",
        data: token
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        status: "error",
        message: "There was a problem creating the user, please try again later."
      });
    }
  }

  async login({
    request,
    response,
    auth
  }) {
    // console.log(request.inp)
    try {
      const token = await auth.attempt(request.input('email'), request.input('password'))
      return response.json({
        status: 'success',
        data: token
      })
    } catch (error) {
      console.log(error)
      return response.status(400).json({
        statut: 'error',
        message: 'invalid/message'
      })
    }
  }

  async me({
    response,
    auth
  }) {
    // auth.current.user.id = 1
    const user = await User.query()
      .where('id', 1)
      .with('tweets', builder => {
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      // .with('following')
      .with('followers')
      .with('favorites')
      .with('favorites.tweet', builder => {
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .firstOrFail()

    return response.json({
      status: 'success',
      data: user
    })
  }
}

module.exports = UserController;
