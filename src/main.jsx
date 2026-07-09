import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import NotFound from './components/NotFound/NotFound.jsx'
import './styles/global.scss'

// Админка живёт на /admin и грузится лениво — в основной бандл сайта не попадает
const AdminApp = React.lazy(() => import('./admin/AdminApp.jsx'))

const path = window.location.pathname
const isAdminRoute = path.startsWith('/admin')
// Сайт одностраничный: реальные адреса — только «/» и «/admin».
// Всё остальное отдаём страницу 404.
const isHomeRoute = path === '/' || path === '' || path === '/index.html'

function Root() {
  if (isAdminRoute) {
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    )
  }
  if (isHomeRoute) return <App />
  return <NotFound />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
