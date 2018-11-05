"use strict";

const User = use("App/Models/User");
const Hash = use('Hash')
const Database = use('Database')

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
      .where('id', auth.current.user.id)
      .with('tweets', builder => {
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .with('following')
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

  async updateProfil({
    request,
    response,
    auth
  }) {
    try {
      //get current user
      const user = auth.current.user
      //get input data
      user.username = request.input('name')
      user.email = request.input('email')
      user.location = request.input('location')
      user.bio = request.input('bio')
      user.website_url = request.input('website_url')
      await user.save()
      return response.json({
        status: 'success',
        message: 'Profile updated!',
        data: user
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem updating profile, please try again later.'
      })
    }
  }

  async test({
    request,
    response,
    auth
  }) {
    // const user = await User.query().where('id', 1).first()

    // const usersAlreadyFollowing = await user.followers().fetch()
    // const query = Database.table('users')
    const allUsers = await User.query().where('users.id', 1)
      .innerJoin('followers', 'users.id', 'followers.user_id').fetch()

    // const usersToFollow = await User.query()
    //   .whereNot('id', user.id)
    //   .whereNotIn('id', usersAlreadyFollowing).pick()
    // .pick(3)
    return response.json({
      allUsers
    })

  }

  async changePassword({
    request,
    response,
    auth
  }) {
    const user = auth.current.user
    const verifyPassword = await Hash.verify(request.input('password'), user.password)
    if (!verifyPassword) {
      return response.status(400).json({
        status: 'error',
        message: 'Current password could not be verified! Please try again.'
      })
    }
    user.password = await Hash.make(request.input('newPassword'))
    await user.save()

    return response.json({
      status: 'success',
      message: 'Password updated!'
    })
  }

  async showProfile({
    request,
    params,
    response
  }) {
    try {
      const user = await User.query()
        .where('username', params.username)
        .with('tweets', builder => {
          builder.with('user')
          builder.with('favorites')
          builder.with('replies')
        })
        .with('following')
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
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }
  }

  async usersToFollow({
    params,
    auth,
    response
  }) {
    // get currently authenticated user
    const user = auth.current.user

    // get the IDs of users the currently authenticated user is already following
    const usersAlreadyFollowing = await user.following().ids()

    // fetch users the currently authenticated user is not already following
    const usersToFollow = await User.query()
      .whereNot('id', user.id)
      .whereNotIn('id', usersAlreadyFollowing)
      .pick(3)

    return response.json({
      status: 'success',
      data: usersToFollow
    })
  }

}

module.exports = UserController;
