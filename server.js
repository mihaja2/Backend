const express = require('express');
const connection = require('./config/db');
const cors = require('cors');
const path = require('path')
// connect to the database
connection();

//Init Middleware

const app = express();

app.use(cors());
app.use(express.json({extend: false}));
app.use('/images',express.static(path.join(__dirname,'/images')));
app.use('/images/post',express.static(path.join(__dirname,'/images/post')));
app.use('/images/profile',express.static(path.join(__dirname,'/images/profile')))

app.get('/',(req, res)=> res.send("Hello world"));
 
app.use('/api/users', require('./routes/user/user'));
app.use('/api/auths', require('./routes/auth/auth'));
app.use('/api/profiles', require('./routes/user/profile'));
app.use('/api/posts', require('./routes/post/post'));
app.use('/api/comments', require('./routes/comment/comment'));
app.use('/api/toggle_postlike', require('./routes/post/postlike'));
app.use('/api/toggle_commentlike', require('./routes/comment/commentlike'));
app.use('/api/admin', require('./routes/admin/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`Server start on port ${PORT}`));
