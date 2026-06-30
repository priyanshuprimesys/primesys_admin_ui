import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CombineContextProvider } from "./contexts/CombineContext/CombineContextProvider";
import RenderRoutes from "./routes/RenderRoutes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./global/styles/GlobalCss.css";
import "react-datepicker/dist/react-datepicker.css";
import { ChakraProvider } from "@chakra-ui/react";
import "../node_modules/leaflet/dist/leaflet.css";
import 'leaflet/dist/leaflet.css';
import 'leaflet.vectorgrid';
import '@xyflow/react/dist/style.css';

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CombineContextProvider>
      <ChakraProvider toastOptions={{defaultOptions:{position:"top-right"}}}>
        <QueryClientProvider client={queryClient}>
          <RenderRoutes />
          <ToastContainer />
        </QueryClientProvider>
      </ChakraProvider>
    </CombineContextProvider>
  </React.StrictMode>
);
