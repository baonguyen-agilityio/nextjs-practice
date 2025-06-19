import { render, screen } from "@testing-library/react";
import { Card, CardBody } from "@heroui/react";

describe("Card Component", () => {
  it("should render card with content", () => {
    render(
      <Card>
        <CardBody>
          <p>Card content</p>
        </CardBody>
      </Card>
    );

    const content = screen.getByText("Card content");
    expect(content).toBeInTheDocument();
  });

  it("should render card with shadow", () => {
    render(
      <Card shadow="md">
        <CardBody>
          <p>Shadow card</p>
        </CardBody>
      </Card>
    );

    const content = screen.getByText("Shadow card");
    expect(content).toBeInTheDocument();
  });

  it("should render pressable card", () => {
    render(
      <Card isPressable>
        <CardBody>
          <p>Pressable card</p>
        </CardBody>
      </Card>
    );

    const content = screen.getByText("Pressable card");
    expect(content).toBeInTheDocument();
  });
});
