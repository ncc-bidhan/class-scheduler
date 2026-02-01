import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout";
import CalendarPage from "./pages/CalendarPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import BranchDetailPage from "./pages/BranchDetailPage";
import InstructorDetailPage from "./pages/InstructorDetailPage";
import RoomDetailPage from "./pages/RoomDetailPage";
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
            <Route path="/branches/:id" element={<BranchDetailPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/instructors/:id" element={<InstructorDetailPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
          </Routes>
        </MainLayout>
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
