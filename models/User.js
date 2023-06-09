const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const { isResolvable } = require("@hapi/joi/lib/common");
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    require: true
  },
  image: {
    type: String
  },
  created_at: {
  type: Date,
  default: Date.now
  },
  updated_at: {
  type: Date,
  default: Date.now
 }
});

userSchema.pre('save',function(next){
  const user = this;
  if (!user.isModified('password')) {
    return next()
  }

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(user.password,salt,(err,hash) => {
    if (err) {
      return next(err)
    }
    user.password = hash;
    next()
  })
})
})


userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;
  return new Promise((resolve,reject) => {
    bcrypt.compare(candidatePassword,user.password,(err,isMatch) => {
      if (err) {
        return reject(err)
      }
      if (!isMatch) {
        return reject(err)
      }
      resolve(true)
    })
  })
}

module.exports = mongoose.model("User", userSchema);