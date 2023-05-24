import ReactDOM from "react-dom/client";
import {
  RouterProvider,
} from "react-router-dom";
import {store} from "./stores";
import {Provider} from "react-redux";
import router from "./router";
import './styles/common.css';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
