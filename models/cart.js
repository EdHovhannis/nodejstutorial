const path = require('path');
const fs = require('fs');
const { count } = require('console');

class Cart {
  static async add(course) {
    const cart = await Cart.fetch();
    const idx = cart.courses.findIndex((crt) => crt.id === course.id);
    const candidate = cart.courses[idx];
    if (candidate) {
      candidate.count++;
      cart.courses[idx] = candidate;
    } else {
      course.count = 1;
      cart.courses.push(course);
    }
    cart.price += Number(course.price);
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'cart.json'),
        JSON.stringify(cart),
        (err) => {
          if (err) reject;
          resolve();
        }
      );
    });
  }
  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'cart.json'),
        { encoding: 'utf-8' },
        (err, data) => {
          if (err) reject(err);
          resolve(JSON.parse(data));
        }
      );
    });
  }

  static async findByIdAndDelete(id) {
    const cart = await Cart.fetch();
    const idx = cart.courses.findIndex((course) => course.id === id);
    const course = cart.courses[idx];
    if (course.count === 1) {
      cart.courses = cart.courses.filter((course) => course.id !== id);
    } else {
      cart.courses[idx].count--;
    }
    cart.price -= course.price;
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'cart.json'),
        JSON.stringify(cart),
        (err) => {
          if (err) reject;
          resolve(cart);
        }
      );
    });
  }
}

module.exports = Cart;
