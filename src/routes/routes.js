import Teachable from "../Page/Teachable";

const { createBrowserRouter } = require("react-router-dom");
const { default: Demo } = require("../Page/Demo");

export const routerPage = createBrowserRouter([
  {
    path: "/",
    element: <Demo />,
  },
  {
    path: "/test",
    element: <Teachable />,
  },
]);
