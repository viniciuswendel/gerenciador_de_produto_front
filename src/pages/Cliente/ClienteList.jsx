import React, { useState, useEffect } from 'react'
import axios from '../../api'
import { FaCheckCircle, FaEdit, FaExclamationTriangle, FaPlus, FaQuestionCircle, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import  Modal from 'react-modal'

const ClienteList = () => {

  const [clientes, setClientes] = useState([])
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [tooltipAberto, setTooltipAberto] = useState(false)

  useEffect(() => {
    axios.get("/clientes")
    .then(response => setClientes(response.data))
    .catch(error => console.error("Erro ao carregador clientes: ", error))
  },[])

  const abrirModal = (cliente) => {
    setClienteSelecionado(cliente)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setClienteSelecionado(null)
  }

  const abrirModalSucesso = () => {
    setModalSucessoAberto(true)
    setTimeout(() => setModalSucessoAberto(false), 2000)
  }

  const removerCliente = () => {
    axios.delete(`/clientes/${clienteSelecionado.id}`)
    .then(() => {
      setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== clienteSelecionado.id))
      fecharModal()
      abrirModalSucesso()
    })
  }

  const toggleTooltip = () => {
    setTooltipAberto(!tooltipAberto) //Alternando o valor do tooltip
  }

  return (
    <div className='container mt-5'>
      <h2 className='mb-4' style={{ position: 'relative' }}>Lista de Clientes
        <FaQuestionCircle
          className="tooltip-icon"
          onClick={toggleTooltip}
          // onMouseOver={toggleTooltip}
          // onMouseOut={toggleTooltip}
        />
        {tooltipAberto && (<div className="tooltip">
          Aqui você pode ver, editar ou excluir clientes do sistema.
        </div>
        )}
      </h2>
      
      <Link to="/add-clientes" className="btn btn-primary mb-2">
      <FaPlus className="icon" /> Adicionar Cliente</Link>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</td>
                <td>{cliente.email}</td>
                <td>{cliente.endereco.logradouro}, n°{cliente.endereco.numero}, {cliente.endereco.complemento} - {cliente.endereco.bairro}, {cliente.endereco.cep},<br/>{cliente.endereco.cidade}-{cliente.endereco.estado}, {cliente.endereco.pais}</td>
                <td>
                  <Link to={`/edit-clientes/${cliente.id}`} className="btn btn-sm btn-warning">
                    <FaEdit className="icon icon-btn"/>Editar
                  </Link>
                  <button onClick={() => abrirModal(cliente)} className="btn btn-sm btn-danger">
                    <FaTrash className="icon icon-btn" />
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <Modal
        isOpen={modalAberto}
        onRequestClose={fecharModal}
        className='modal'
        overlayClassName='overlay'
      >
        <div className='modalContent'>
          <FaExclamationTriangle className='icon'/>
          <h2>Remoção do item</h2>
          <p>Você tem certeza que deseja remover o cliente&nbsp;
            <b>{clienteSelecionado && clienteSelecionado.nome}</b>?
          </p>
          <div className='modalButtons'>
            <button onClick={fecharModal} className='btn btn-secondary'>Não</button>
            <button onClick={removerCliente} className='btn btn-danger'>Sim</button>
          </div>
        </div>

      </Modal>

      <Modal
        isOpen={modalSucessoAberto}
        onRequestClose={() => setModalSucessoAberto(false)}
        className='modal'
        overlayClassName='overlay'
      >

        <div className='modalContent'>
          <FaCheckCircle className='icon successIcon' />
          <h2>Cliente excluído com sucesso!</h2>
        </div>

      </Modal>
      
    </div>
  )
}

export default ClienteList