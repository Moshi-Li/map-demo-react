import { Provider as StoreProvider } from "react-redux";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

import store from "./Store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
);
