import React from "react";
import { render, screen } from "@testing-library/react";
import DecoratedText from "./DecoratedText";

describe("DecoratedText", () => {
  it("renders bold, hashtags, mentions, and links correctly by default", () => {
    const text = "Hello **bold** world #tag @user http://example.com";
    render(<DecoratedText text={text} />);

    // Bold text should render as bold segment
    expect(screen.getByText("bold")).toBeInTheDocument();

    // Hashtag pill
    expect(screen.getByText("#tag")).toBeInTheDocument();

    // Mention pill
    expect(screen.getByText("@user")).toBeInTheDocument();

    // Link rendered as anchor
    const link = screen.getByText("http://example.com");
    expect(link.tagName).toBe("A");
    expect((link as HTMLAnchorElement).href).toContain("http://example.com");
  });

  it("applies custom colors when provided via tokenColors prop", () => {
    const text = "Test **bold** #green @you https://link.dev";
    const tokenColors = {
      hashtag: "bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full",
      mention: "bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full",
      link: "text-pink-600 underline",
      bold: "font-extrabold",
    } as const;
    render(<DecoratedText text={text} tokenColors={tokenColors as any} />);

    // Hashtag color class should be present on the tag element
    const hashEl = screen.getByText("#green");
    expect(hashEl.className).toContain("bg-green-100");

    // Mention color class
    const atEl = screen.getByText("@you");
    expect(atEl.className).toContain("bg-yellow-100");

    // Bold style class
    const boldEl = screen.getByText("bold");
    expect(boldEl.className).toContain("font-extrabold");

    // Link exists as anchor
    const linkEl = screen.getByText("https://link.dev");
    expect(linkEl.tagName).toBe("A");
  });
});
