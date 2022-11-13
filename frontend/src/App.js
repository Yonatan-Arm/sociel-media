import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./assets/scss/global.scss";
import Navbar from "./components/Navbar";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Edit from "./pages/Edit";
import Explore from "./pages/Explore";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </div>
        <Routes>
          <Route path="edit/:id" element={<Edit />} />
          <Route path="edit" element={<Edit />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="explore" element={<Explore />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="contacts" element={<Home />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
