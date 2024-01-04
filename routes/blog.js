const express = require('express');
const multer = require('multer');
const router = express.Router();
const Blog = require('../models/blog');
const path = require('path');
const slugify = require('slugify');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get('/write-blog', (req, res) => {
    return res.render('writeBlog',
        { user: req.user }
    )
});
router.post('/write-blog', upload.single('coverImage'), async (req, res) => {
    const { title, body, shortDesc, slug } = req.body;
    if (!title || !body || !shortDesc || !req.file) {
        return res.render('writeBlog',
            {
                user: req.user,
                error: "All Fields are required",
            }
        )
    }
    const _slug = slugify(title);
    try {

        const blog = await Blog.create({
            title,
            body,
            slug: _slug,
            shortDesc,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`,
        });

        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        return res.render('writeBlog',
            {
                user: req.user,
                slug: _slug,
                error: error
            }
        )
    }


});



module.exports = router;