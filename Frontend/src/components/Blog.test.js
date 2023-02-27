import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

describe("Blog Component", () => {
  const blog = {
    id: 0,
    title: "Test Blog",
    url: "Shaat",
    likes: 0,
    author: {
      id: 0,
      username: "Artis_",
      name: "Huzaifa Ahmed",
    },
    user: {
      username: "Huzaifa Ahmed",
    },
  };
  test("Blog details are hidden by default", () => {
    const element = render(
      <Blog blog={blog} likeBlog={() => {}} deleteBlog={() => {}} />
    ).container;

    const collapsedText = screen.getByText("Test Blog - Huzaifa Ahmed");
    const toggleContent = element.querySelector(".toggleContent");

    expect(collapsedText).toBeDefined();
    expect(toggleContent).toHaveStyle({ display: "none" });
  });

  test("Blog details are shown on click", async () => {
    const mockHandler = jest.fn();

    const element = render(
      <Blog blog={blog} likeBlog={mockHandler} deleteBlog={mockHandler} />
    ).container;

    // const user = userEvent.setup();
    const viewButton = screen.getByText("View");
    await userEvent.click(viewButton);

    const toggleContent = element.querySelector(".toggleContent");
    expect(toggleContent).not.toHaveStyle({ display: "none" });
  });

  test("Event handler for likes is called twice", async () => {
    const mockHandler = jest.fn();

    render(<Blog blog={blog} likeBlog={mockHandler} deleteBlog={mockHandler} />)
      .container;

    const likeButton = screen.getByText("Like");
    await userEvent.click(likeButton);
    await userEvent.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
