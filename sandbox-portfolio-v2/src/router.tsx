import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Portfolio3D from "./pages/Portfolio3D";
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
    element: <Portfolio3D />,
  },
  {
    path: "/old",
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
  basename: "/sandbox-portfolio-v2"
});

export default function Router() {
  return <RouterProvider router={router} />;
}