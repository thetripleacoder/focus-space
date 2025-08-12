import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  let container;
  const mockHandler = vi.fn();

  beforeEach(() => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'sample author',
      id: 212,
      url: 'https://example.com',
      likes: 2,
    };

    container = render(
      <Blog blog={blog} likeBlog={mockHandler} removeBlog={mockHandler} />
    ).container;
  });

  test("checks that the component displaying a blog renders the blog's title and author, but does not render its URL or number of likes by default", async () => {
    // checks blog title and author are displayed
    const blogTitle = container.querySelector('.blogTitle');
    const blogAuthor = container.querySelector('.blogAuthor');
    expect(blogTitle).toBeDefined();
    expect(blogAuthor).toBeDefined();

    // checks blog url and likes are not displayed
    const blogUrl = screen.queryByText('https://example.com');
    const blogLikes = screen.queryByText('2');
    expect(blogUrl).toBeNull();
    expect(blogLikes).toBeNull();

    screen.debug();
  });

  test("Make a test, which checks that the blog's URL and number of likes are shown when the button controlling the shown details has been clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByText('Show');
    await user.click(button);

    // checks blog url and likes are displayed
    const blogUrl = container.querySelector('.blogUrl');
    const blogLikes = container.querySelector('.blogLikes');
    expect(blogUrl).toBeDefined();
    expect(blogLikes).toBeDefined();
  });

  test('Make a test, which ensures that if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const user = userEvent.setup();

    const showButton = screen.getByText('Show');
    await user.click(showButton);
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
