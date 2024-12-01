import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Parse from "parse";

const appId = "Jn2nFHOhB493ymQJuBrN75XlQyjd1NvIbpULEnsp";
const serverURL = "https://parseapi.back4app.com/";
const javascriptKey = "wJk6F64XHBPRN7Qc1udFlcxBbOcw8UAUCilVXFYC";
Parse.initialize(appId, javascriptKey);
Parse.serverURL = serverURL;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <PostProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
