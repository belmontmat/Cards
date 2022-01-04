import React from "react";
import { render } from "@testing-library/react";
import { App } from "../App.js";

describe("App Component", function () {
  it("should start blank", function () {
    let { getTable } = render(<App />);
    //expect(getTable("")).toMatchSnapshot()
  });
});
