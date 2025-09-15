import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import AppointmentForm from './components/AppointmentForm'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'

function App() {
  const [language, setLanguage] = useState('ar')
  const [currentPage, setCurrentPage] = useState('home')

  // Check if current URL is admin
  const isAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin'

  if (isAdmin || currentPage === 'admin') {
    return <AdminPanel language={language} />
  }

  return (
    <div className="min-h-screen">
      <Header language={language} setLanguage={setLanguage} />
      <Hero language={language} />
      <Services language={language} />
      <AppointmentForm language={language} />
      <Footer language={language} />

      {/* Hidden Admin Access - can be accessed via URL hash */}
      {window.location.hash === '#admin-access' && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setCurrentPage('admin')}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900"
          >
            Admin Panel
          </button>
        </div>
      )}
    </div>
  )
}

export default App
