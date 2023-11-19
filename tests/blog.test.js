const { dummy, totalLikes, favoriteBlog, mostBlogs, authorMostLikes} = require('../utils/list_helper')
const helper = require('./supertest_helper')

describe('blog list tests', () => {
  const blogs = helper.initialBlogs

  test('dummy returns one', () => {
    const result = dummy(blogs)
    expect(result).toBe(1)
  })

  test('get total of likes', () => {
    const result = totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('get the most liked blog', () => {
    const result = favoriteBlog(blogs)
    expect(result).toEqual(blogs[2])
  })

  test('author with most blogs', () => {
    const result = mostBlogs(blogs)
    expect(result.author).toBe('Robert C. Martin')
    expect(result.blogs).toBe(3)
  })

  test('author with most likes', () => {
    const result = authorMostLikes(blogs)
    expect(result.author).toBe('Edsger W. Dijkstra')
    expect(result.likes).toBe(17)
  })
})