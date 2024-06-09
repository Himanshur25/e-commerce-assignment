import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";
import GlobalProvider from "../providers/GlobalProvider";

const renderHomeSection = () => {
  return render(
    <GlobalProvider>
      <Router>
        <HomePage />
      </Router>
    </GlobalProvider>
  );
};

describe("It should render home component successfully", () => {
  it("should render product list button successfully", async () => {
    renderHomeSection();
    const loginButton = screen.getByRole("button");
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
    expect(loginButton).toBeInTheDocument();
  });

  it("should navigate to term amd condition page after clicking on text", async () => {
    renderHomeSection();
    const loginButton = screen.getByRole("button");
    fireEvent.click(loginButton);
    expect(window.location.pathname).toBe("/product");
  });
});
