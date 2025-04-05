import React from 'react'
import './index.css'
import FornecedorList from './pages/Fornecedor/FornecedorList'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ClienteList from './pages/Cliente/ClienteList'
import ProdutoList from './pages/Produto/ProdutoList'
import FornecedorForm from './pages/Fornecedor/FornecedorForm'
import Navbar2 from './components/Navbar2'
import Inicial from './pages/Inicial'
import ClienteForm from './pages/Cliente/ClienteForm'
import ProdutoForm from './pages/Produto/ProdutoForm'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/PrivateRoute'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={
        <PrivateRoute>
          <>
            <Navbar2 />
            <Routes>
              <Route path="/" element={<Inicial />} />
              <Route path="/listar-fornecedores" element={<FornecedorList />} />
              <Route path="/add-fornecedores" element={<FornecedorForm />} />
              <Route path="/edit-fornecedores/:id" element={<FornecedorForm />} />
              <Route path="/add-produtos" element={<ProdutoForm />} />
              <Route path="/listar-produtos" element={<ProdutoList />} />
              <Route path="/edit-produtos/:id" element={<ProdutoForm />} />
              <Route path="/add-clientes" element={<ClienteForm />} />
              <Route path="/edit-clientes/:id" element={<ClienteForm />} />
              <Route path="/listar-clientes" element={<ClienteList />} />
            </Routes>
          </>
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App