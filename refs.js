/* // module path 
// const path = require('path');

// console.log(path.basename(__filename)); // index.js
// console.log(path.dirname(__filename)); // index.js
// console.log(path.extname(__filename)); //  .js
// console.log(path.parse(__filename)); //  { root: 'C:\\', dir: 'C:\\Users\\edocr\\OneDrive\\Рабочий стол\\NodeJS', base: 'index.js', ext: '.js',  name: 'index' }
// console.log(path.join('src', 'index.js')); // src\index.js
// console.log(path.join(__dirname, 'src', 'index.js')); // C:\Users\edocr\OneDrive\Рабочий стол\NodeJS\src\index.js
// console.log(path.resolve('src', 'index.js')); // C:\Users\edocr\OneDrive\Рабочий стол\NodeJS\src\index.js
// console.log(path.resolve('src', '/index.js')); // C:\index.js
*/

/* // module fs

// const fs = require('fs');
// const path = require('path');
// fs.mkdir(path.join(__dirname, 'dir'), (e) => {
//   e ? console.log(e) : console.log('dir was created');
// });

// fs.writeFile(path.join(__dirname, 'dir', 'dir.js'), 'lick my ass', (e) =>
//   e
//     ? console.log(e)
//     : fs.writeFile(path.join(__dirname, 'dir', 'dir.js'), 'tooo', (e) =>
//         e ? console.log(e) : console.log('file was changed')
//       )
// );

// fs.readFile(
//   path.join(__dirname, 'dir', 'dir.js'),
//   // { encoding: 'utf-8' },
//   (err, data) => {
//     if (err) throw new Error();
//     console.log(data.toString());
//   }
// );

// fs.rename(
//   path.join(__dirname, 'dir', 'dir.js'),
//   path.join(__dirname, 'dir', 'gleb.js'),
//   () => {}
// );

 */

/* 
// module os


// const os = require('os');

// console.log(os.platform()); // win32
// console.log(os.arch()); // x64
// console.log(os.cpus()); // big object
// console.log(os.cpus()); // big object
// console.log(os.freemem()); // number about free memory
// console.log(os.totalmem()); // number about total memory
// console.log(os.homedir()); // C:\Users\edocr
*/

/*
// module events
// const events = require('events');

// const event = new events.EventEmitter();

// event.on('message', function (message) {
//   console.log('hello world', message);
// });
// event.emit('message', 'frau');
*/
/*
// module http
 // const http = require('http');

// http
//   .createServer((req, res) => {
//     console.log(req.url);
//     res.write('hello world');
//     res.end('bye world');
//   })
//   .listen(3000, () => console.log('server is Working'));
*/
