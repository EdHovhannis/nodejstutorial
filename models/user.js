const { Schema, model } = require('mongoose');

const User = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    requred: true,
  },
  password: {
    type: String,
    requred: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
      },
    ],
  },
});

User.methods.addToCart = function (course) {
  const items = [...this.cart.items];
  const idx = items.findIndex(
    (crs) => crs.courseId.toString() == course._id.toString()
  );
  if (idx >= 0) {
    items[idx].count++;
  } else {
    items.push({ count: 1, courseId: course._id });
  }
  this.cart = { items };
  return this.save();
};

User.methods.removeFromCart = function (id) {
  let items = [...this.cart.items];
  const idx = items.findIndex(
    (crs) => crs.courseId.toString() == id.toString()
  );
  if (items[idx].count === 1) {
    items = items.filter((crs) => crs.courseId.toString() !== id.toString());
  } else {
    items[idx].count--;
  }
  this.cart = { items };
  return this.save();
};

User.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model('User', User);
