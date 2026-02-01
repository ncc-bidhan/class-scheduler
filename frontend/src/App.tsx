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
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<CalendarPage />} />
              <Route path="/classes/:id" element={<ClassDetailPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/branches/:id" element={<BranchDetailPage />} />
              <Route path="/instructors" element={<InstructorsPage />} />
              <Route path="/instructors/:id" element={<InstructorDetailPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />
            </Route>
          </Route>
        </Routes>
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
