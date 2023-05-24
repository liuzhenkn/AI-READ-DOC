import {
  createBrowserRouter,
} from "react-router-dom";
import Root from "./routes/root/root";
import Index from "./routes/index/index";
import Chat from "./routes/chat/chat";
import ResetPassword from "./routes/reset-password/reset-password";
import Faq from "./routes/faq/faq";
import ErrorPage from "./routes/error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/chat/:id",
        element: <Chat />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/faq",
        element: <Faq />,
      }
    ],
  },
]);

export default router;