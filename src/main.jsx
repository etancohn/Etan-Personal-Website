import React from 'react'
import ReactDOM from 'react-dom/client'
import HomePage from './pages/Home/HomePage.jsx'
import ErrorPage from "./components/error-page.jsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import UnderConstruction from './pages/UnderConstruction/UnderConstruction.jsx'
import ShoppingList from './pages/Projects/ShoppingList/ShoppingList.jsx'
import MusicGenres from './pages/Projects/MusicGenres/MusicGenres.jsx'
import SoftwareResume from './pages/SoftwareResume/SoftwareResume.jsx'
import ProjectsPage from './pages/ProjectsPage/ProjectsPage.jsx'
import SlangTranslator from './pages/Projects/SlangTranslator/SlangTranslator.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "pages/under-construction",
    element: <UnderConstruction />
  },
  {
    path: "pages/Projects/ShoppingList",
    element: <ShoppingList />
  },
  {
    path: "pages/Projects/MusicGenres",
    element: <MusicGenres />
  },
   {
    path: "pages/software-resume",
    element: <SoftwareResume />
   },
   {
    path: "pages/projects-page",
    element: <ProjectsPage />
   },
   {
    path: "/pages/Projects/SlangTranslator",
    element: <SlangTranslator />

   }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <HomePage /> */}
  </React.StrictMode>,
)
