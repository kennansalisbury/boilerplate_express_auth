'use strict';

let bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Your first name must be filled in' //message if validate condition not met
        }
      }
    },
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Please give a valid email address 😱'
        }
      }
    },
    username: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 25], //min and max length
          msg: 'Your password must be between 6 and 25 characters'
        }
      }
    },
    photoURL: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'Need a url'
        }
      }
    },
    bio: DataTypes.TEXT,
    admin: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: pendingUser => {
        if (pendingUser && pendingUser.password) { //if there is a pending user and they have a truthy password (not empty or undefined)
          //Hash the password
          let hashedPassword = bcrypt.hashSync(pendingUser.password, 12) //hashSync forces it to wait until after the password is hashed, first argument is plaintext password you want to hash, second argument is number of times it is rehashed/number of rounds for generating the salt

          //Reassign the password field to the hashed value
          pendingUser.password = hashedPassword
        } 

      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
  };

  user.prototype.validPassword = function(typedInPassword) {
    // determine if typed-in password hashes to same thing as existing hash
    let correctPassword = bcrypt.compareSync(typedInPassword, this.password)
    // return result of that comparison
    return correctPassword
  }

  return user;
};