import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("SSR application routes", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the secret portal and its primary routes", () => {
    renderApp("/");

    expect(
      screen.getByRole("heading", {
        name: "No todos escuchan la frecuencia.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vault" })).toHaveAttribute(
      "href",
      "/vault",
    );
  });

  it("opens the demo member dashboard after login", async () => {
    const user = userEvent.setup();
    renderApp("/login");

    await user.click(screen.getByRole("button", { name: "Entrar al archivo" }));

    expect(
      await screen.findByRole("heading", { name: "Matriz sonora" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Inner Circle").length).toBeGreaterThan(0);
  });
});
