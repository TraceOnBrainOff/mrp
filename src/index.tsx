import React from "react";
import ReactDOM from "react-dom";

import { MantineProvider } from "@mantine/core";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "light" }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
