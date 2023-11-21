const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const result = blogs.reduce((accumulator, current) => {
    return accumulator?.likes > current.likes ? accumulator : current
  }, null)
  return result
}

const mostBlogs = (blogs) => {
  const blogCountByAuthor = new Map() // key is author, value is count
  
  blogs.forEach(blog => {
    const count = blogCountByAuthor.get(blog.author)
    if (count) {
      blogCountByAuthor.set(blog.author, count + 1)
    } else {
      blogCountByAuthor.set(blog.author, 1)
    }
  })
  const sorted = new Map([...blogCountByAuthor.entries()].sort((count_a, count_b) => count_b[1] - count_a[1]))
  const result = [...sorted][0]
  console.log(JSON.stringify(result))
  return {author: result[0], blogs: result[1]}
}

const authorMostLikes = (blogs) => {
  const likesByAuthor = new Map() // key is author, value is count
  
  blogs.forEach(blog => {
    const likesTotal = likesByAuthor.get(blog.author)
    if (likesTotal) {
      likesByAuthor.set(blog.author, likesTotal + blog.likes)
    } else {
      likesByAuthor.set(blog.author, blog.likes)
    }
  })
  
  const sorted = new Map([...likesByAuthor.entries()].sort((likes_a, likes_b) => likes_b[1] - likes_a[1]))
  const result = [...sorted][0]
  console.log(JSON.stringify(result))
  return {author: result[0], likes: result[1]}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  authorMostLikes,
}
