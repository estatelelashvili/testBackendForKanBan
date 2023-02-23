const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.set('strictQuery', false);
mongoose
  .connect(
    'mongodb+srv://estatelelashvili:1987@cluster0.wqzbbzf.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send('Email and password are required');
    return;
  }

  const user = new User({ email, password });
  user
    .save()
    .then(() => res.status(200).json({ message: 'User saved' }))
    .catch((err) => {
      console.log(err);
      res.status(500).send('Server error');
    });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send('Email and password are required');
    return;
  }

  User.findOne({ email, password })
    .then((user) => {
      if (user) {
        res.status(200).json({ authenticated: true });
      } else {
        res.status(401).json({ authenticated: false });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Server error');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port} `));
