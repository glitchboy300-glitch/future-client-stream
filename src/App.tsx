import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AppShell } from "./AppShell";
import { AppRoutes } from "./AppRoutes";

const App = () => (
  <HelmetProvider>
    <AppShell>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppShell>
  </HelmetProvider>
);

export default App;
