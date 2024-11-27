import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import CodeEditor from './pages/CodeEditor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/editor/:roomId' element={<CodeEditor />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
