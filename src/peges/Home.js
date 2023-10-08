import React from 'react'
import { Outlet } from 'react-router-dom'
//Нужно выбрать главный цвет Фщна

const Home = () => {
  return (
    <main className="bg-red w-full h-full flex flex-col first-letter: 
      content-center items-center relative text-dark font-nunito">Home
    <div className="w-screen h-screen" />                                                                     
        <Outlet />
    </main>
  )
}

export default Home