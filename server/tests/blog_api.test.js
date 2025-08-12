const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const helper = require('./test_helper');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

let Blog;
// Check for Model Existence before Compiling
if (mongoose.models.Blog) {
  Blog = mongoose.model('Blog');
} else {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
  });

  blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

  Blog = mongoose.model('Blog', blogSchema);
}

describe('Node testing libraries', () => {
  describe('when there is initially some blogs saved', () => {
    let token = null;
    const userForToken = {
      username: 'username',
      id: '61d634706a98a61edd42bf45',
    };
    beforeEach(async () => {
      await Blog.deleteMany({});
      token = jwt.sign(userForToken, process.env.SECRET);
      for (let blog of helper.initialBlogs) {
        let blogObject = new Blog({
          ...blog,
          user: new ObjectId(userForToken.id),
        });
        await blogObject.save();
      }
    });

    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // Works.
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('all blogs are returned', async () => {
      const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`); // Works.;

      // execution gets here only after the HTTP request is complete
      // the result of HTTP request is saved in variable response
      assert.strictEqual(response.body.length, 6);
    });

    describe('addition of a new blog', () => {
      test('successfully creates a new blog post', async () => {
        const newBlog = {
          title: 'React patterns2',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/',
          __v: 0,
        };

        await api
          .post('/api/blogs')
          .send({
            ...newBlog,
            user: new ObjectId(userForToken.id),
          })
          .set('Authorization', `Bearer ${token}`) // Works.
          .expect(201)
          .expect('Content-Type', /application\/json/);

        // total number of blogs in the system is increased by one
        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

        // verify that the content of the blog post is saved correctly to the database
        const titles = blogsAtEnd.map((n) => n.title);
        assert(titles.includes(newBlog.title));

        // likes property is missing from the request, it will default to the value 0.
        const addedBlog = blogsAtEnd.find(
          (blog) => blog.title === newBlog.title
        );
        assert.strictEqual(addedBlog.likes, 0);
      });

      test('fails with status code 400 if data invalid', async () => {
        const newBlog = {
          important: true,
        };

        await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', `Bearer ${token}`); // Works..expect(400);

        const blogsAtEnd = await helper.blogsInDb();

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
      });
    });

    describe('viewing a specific blog', () => {
      test.only('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb();

        const blogToView = blogsAtStart[0];

        const resultBlog = await api
          .get(`/api/blogs/${blogToView._id.toString()}`)
          .set('Authorization', `Bearer ${token}`) // Works.
          .expect(200)
          .expect('Content-Type', /application\/json/);
        // console.log(resultBlog.body, blogToView);
        assert(resultBlog.data._id.toString(), blogToView._id.toString());
        // assert.deepStrictEqual(resultBlog.body, blogToView);
      });
    });

    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const titles = blogsAtEnd.map((r) => r.title);
      assert(!titles.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });

    test('a blog can be edited', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToEdit = blogsAtStart[0];

      let updates = {
        title: 'React patternsssss',
        likes: 4,
      };

      await api
        .patch(`/api/blogs/${blogToEdit.id}`)
        .send(updates)
        .set('Authorization', `Bearer ${token}`); // Works..expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      // likes property is missing from the request, it will default to the value 0.
      const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToEdit.id);
      assert(updatedBlog.title === updates.title);
    });
  });

  describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash('sekret', 10);
      const user = new User({ username: 'root', passwordHash });

      await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes(newUser.username));
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes('expected `username` to be unique'));

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});

// JEST tests

// describe('Jest: when there is initially some blogs saved', () => {
//   beforeEach(async () => {
//     await Blog.deleteMany({});
//     await Blog.insertMany(helper.initialBlogs);
//   });

//   describe('when there is initially some blogs saved', () => {
//     test('blogs are returned as json', async () => {
//       await api
//         .get('/api/blogs')
//         .expect(200)
//         .expect('Content-Type', /application\/json/);
//     });

//     test('all blogs are returned', async () => {
//       const response = await api.get('/api/blogs');

//       expect(response.body).toHaveLength(helper.initialBlogs.length);
//     });

//     test('a specific blog is within the returned blogs', async () => {
//       const response = await api.get('/api/blogs');

//       const title = response.body.map((r) => r.title);

//       expect(title).toContain('React patterns');
//     });
//   });

//   describe('viewing a specific blog', () => {
//     test('succeeds with a valid id', async () => {
//       const blogsAtStart = await helper.blogsInDb();

//       const blogToView = blogsAtStart[0];

//       const resultBlog = await api
//         .get(`/api/blogs/${blogToView.id}`)
//         .expect(200)
//         .expect('Content-Type', /application\/json/);

//       expect(resultBlog.body).toEqual(blogToView);
//     });

//     test('fails with statuscode 404 if blog does not exist', async () => {
//       const validNonexistingId = await helper.nonExistingId();

//       await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
//     });

//     test('fails with statuscode 400 if id is invalid', async () => {
//       const invalidId = '5a3d5da59070081a82a3445';

//       await api.get(`/api/blogs/${invalidId}`).expect(400);
//     });
//   });

//   describe('addition of a new blog', () => {
//     test('succeeds with valid data', async () => {
//       const newBlog = {
//         title: 'Type wars (copy)',
//         author: 'Robert C. Martin',
//         url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
//         likes: 2,
//       };

//       await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .expect(201)
//         .expect('Content-Type', /application\/json/);

//       const blogsAtEnd = await helper.blogsInDb();
//       expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

//       const titles = blogsAtEnd.map((n) => n.title);
//       expect(titles).toContain(newBlog.title);
//     });

//     test('fails with status code 400 if data invalid', async () => {
//       const newBlog = {
//         important: true,
//       };

//       await api.post('/api/blogs').send(newBlog).expect(400);

//       const blogsAtEnd = await helper.blogsInDb();

//       expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
//     });
//   });

//   describe('deletion of a blog', () => {
//     test('succeeds with status code 204 if id is valid', async () => {
//       const blogsAtStart = await helper.blogsInDb();
//       const blogToDelete = blogsAtStart[0];

//       await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

//       const blogsAtEnd = await helper.blogsInDb();

//       expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

//       const titles = blogsAtEnd.map((r) => r.title);

//       expect(titles).not.toContain(blogToDelete.title);
//     });
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });
// });
