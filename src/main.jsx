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
import EmojiGenerator from './pages/Projects/EmojiGenerator/EmojiGenerator.jsx'
import LinguaLink from './pages/Projects/LinguaLink/LinguaLink.jsx'
import MusicResume from './pages/MusicResume/MusicResume.jsx'

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
    path: "pages/music",
    element: <MusicResume />
   },
   {
    path: "pages/projects-page",
    element: <ProjectsPage />
   },
   {
    path: "/pages/Projects/SlangTranslator",
    element: <SlangTranslator />
   },
   {
    path: "pages/Projects/EmojiGenerator",
    element: <EmojiGenerator />
   },
   {
    path: "pages/Projects/LinguaLink",
    element: <LinguaLink />
   }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <HomePage /> */}
  </React.StrictMode>,
)
