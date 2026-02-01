import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import CalendarPage from "./pages/CalendarPage";
import { BranchesPage } from "./pages/BranchesPage";
import { InstructorsPage } from "./pages/InstructorsPage";
import { RoomsPage } from "./pages/RoomsPage";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <AppShell>
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
          </Routes>
        </AppShell>
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
