import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { config } from "./config/wagmiConfig.ts";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          autoClose={3000}
          hideProgressBar={true}
          closeOnClick
          position={"top-right"}
        />
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
