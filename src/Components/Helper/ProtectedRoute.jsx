import React from 'react'
import UserContext from '../../UserContext'
import { Navigate, Outlet } from 'react-router-dom'

// Isso permite que /conta (rota que mosta informações do usuário) seja mostrado apenas se o estado login for true, caso contrário ele transferirá para a tela de login

const ProtectedRoute = () => {
  const { login } = React.useContext(UserContext)

  if (login === true) return <Outlet/>
  else if (login === false) return <Navigate to="/login"/>
  else return null
}

export default ProtectedRoute
