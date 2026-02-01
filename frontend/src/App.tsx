import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout";
import CalendarPage from "./pages/CalendarPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import { BranchesPage } from "./pages/BranchesPage";
import { InstructorsPage } from "./pages/InstructorsPage";
import { RoomsPage } from "./pages/RoomsPage";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <MainLayout>
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/classes/:id" element={<ClassDetailPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
          </Routes>
        </MainLayout>
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
