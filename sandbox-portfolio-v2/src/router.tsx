import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import Info from "./pages/Info";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:slug", element: <Project /> },
      { path: "info", element: <Info /> },
      { path: "contact", element: <Contact /> },
      { path: "faq", element: <FAQ /> },
    ],
  },
], {
  basename: "/sandbox-portfolio"
});

export default function Router() {
  return <RouterProvider router={router} />;
}