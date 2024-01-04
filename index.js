const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');

const app = express();
const PORT = process.env.PORT

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthCookie("token"));

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    const allBlogs = await
        Blog
            .find({})
            .sort({ "createdAt": -1 })
            .limit(1000);
    return res.render('home', {
        user: req.user,
        blogs: allBlogs
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`InsightInk is running on localhost:${PORT}`));