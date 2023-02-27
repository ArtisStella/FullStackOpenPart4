import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";

describe("Blog Form Component", () => {
  test("Event handler for saving blog is called with proper data.", () => {
    const mockHandler = jest.fn();

    const element = render(<BlogForm saveBlog={mockHandler} />).container;

    const titleInput = element.querySelector(".titleInput");
    userEvent.type(titleInput, "Seventh Blog");
    
    const urlInput = element.querySelector(".urlInput");
    userEvent.type(urlInput, "Shaat Desu");
    
    const saveButton = screen.getByText("Add");
    userEvent.click(saveButton);

    expect(mockHandler.mock.calls[0][0].title).toBe("Seventh Blog");
    expect(mockHandler.mock.calls[0][0].url).toBe("Shaat Desu");
  });
});
