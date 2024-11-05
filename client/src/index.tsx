import { createRoot } from "react-dom/client";
import React from "react";

import { App } from "./App";

const load = () => {
  const element = document.getElementById("app");
  if (!element) {
    throw new Error("unable to find app element");
  }

  const root = createRoot(element);
  root.render(<App />);
};

document.addEventListener("DOMContentLoaded", load);
