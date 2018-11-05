'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  tweets() {
    return this.hasMany('App/Models/Tweet')
  }

  reply() {
    return this.hasMany('App/Models/Reply')
  }

  followers() {
    return this.belongsToMany('App/Models/User', 'user_id', 'follower_id').pivotTable('followers')
    // select follower_id where user_id=1
  }

  following() {
    return this.belongsToMany('App/Models/User', 'follower_id', 'user_id').pivotTable('followers')
    // select user_id where 
  }



  favorites() {
    return this.hasMany('App/Models/Favorite')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
