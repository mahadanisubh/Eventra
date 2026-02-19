import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import './comments.css'
import './countdown.css'
import './registration.css'
import './prosection.css'
import './responsivecss.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <App />
  </BrowserRouter>
)