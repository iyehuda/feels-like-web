import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./layouts/AppLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import MyProfilePage from "./pages/MyProfilePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import ViewPostPage from "./pages/ViewPostPage.tsx";
import NewPostPage from "./pages/NewPostPage.tsx";
import EditPostPage from "./pages/EditPostPage.tsx";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: AppLayout,
        children: [
          {
            path: "",
            Component: HomePage,
          },
          {
            path: "profile",
            Component: MyProfilePage,
          },
          {
            path: "posts/:id",
            Component: ViewPostPage,
          },
          {
            path: "posts/:id/edit",
            Component: EditPostPage,
          },
          {
            path: "/new-post",
            Component: NewPostPage,
          },
        ],
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/signup",
        Component: SignupPage,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
