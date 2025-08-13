/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
// Load the full build.
var _ = require('lodash');
// // Load the core build.
// var _ = require('lodash/core');

// Test Functions
const totalLikes = (blogs) => {
  let result = blogs.reduce((total, currentValue) => {
    return total + currentValue.likes;
  }, 0);
  return result;
};

const favoriteBlog = (blogs) => {
  let list = blogs;
  let faveBlog = list.reduce((accumulator, currentValue) => {
    return accumulator.likes < currentValue.likes ? currentValue : accumulator;
  });
  let result = {
    title: faveBlog.title,
    likes: faveBlog.likes,
  };
  return result;
};

const mostBlogs = (blogs) => {
  let result = blogs.reduce(
    (accumulator, currentValue) => {
      let numOfMatches = blogs.filter(
        (blog) => blog.user._id === currentValue.user._id
      ).length;
      let currentData = {
        blogs: numOfMatches,
      };

      if (accumulator.blogs < numOfMatches) {
        return currentData;
      } else {
        return accumulator;
      }
    },
    {
      blogs: 0,
    }
  );

  // using lodash library - not returning correct value
  // let result = _.maxBy(blogs, function (o) {
  //   return o.blogs;
  // });
  return result;
};

const mostLikes = (blogs) => {
  let result = blogs.reduce(
    (accumulator, currentVal) => {
      if (accumulator.likes < currentVal.likes) {
        return {
          author: currentVal.author,
          likes: currentVal.likes,
        };
      } else {
        return accumulator;
      }
    },
    { author: null, likes: 0 }
  );
  return result;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
