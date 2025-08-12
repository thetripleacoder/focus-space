import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup();
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByPlaceholderText('title');
  const authorInput = screen.getByPlaceholderText('author');
  const urlInput = screen.getByPlaceholderText('url');

  const createButton = screen.getByText('create');

  await user.type(titleInput, 'sample title');
  await user.type(authorInput, 'sample author');
  await user.type(urlInput, 'sample url');
  await user.click(createButton);
  // console.log(JSON.stringify(createBlog.mock.calls));

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].content.title).toBe('sample title');
  expect(createBlog.mock.calls[0][0].content.author).toBe('sample author');
  expect(createBlog.mock.calls[0][0].content.url).toBe('sample url');
});
