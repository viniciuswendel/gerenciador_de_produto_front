import React, { useState, useEffect } from 'react'
import axios from '../../api'
import { FaCheckCircle, FaEdit, FaExclamationTriangle, FaPlus, FaQuestionCircle, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import  Modal from 'react-modal'

const FornecedorList = () => {

  const [fornecedores, setFornecedores] = useState([])
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [tooltipAberto, setTooltipAberto] = useState(false)
  
  useEffect(() => {
    axios.get("/fornecedores")
    .then(response => setFornecedores(response.data))
    .catch(error => console.error("Erro ao carregador fornecedores: ", error))
  },[])

  const abrirModal = (fornecedor) => {
    setFornecedorSelecionado(fornecedor)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setFornecedorSelecionado(null)
  }

  const abrirModalSucesso = () => {
    setModalSucessoAberto(true)
    setTimeout(() => setModalSucessoAberto(false), 2000)
  }

  const removerFornecedor = () => {
    axios.delete(`/fornecedores/${fornecedorSelecionado.id}`)
    .then(() => {
      setFornecedores(prevFornecedores => prevFornecedores.filter(fornecedor => fornecedor.id !== fornecedorSelecionado.id))
      fecharModal()
      abrirModalSucesso()
    })
  }

  const toggleTooltip = () => {
    setTooltipAberto(!tooltipAberto) //Alternando o valor do tooltip
  }

  return (
    <div className='container mt-5'>
      <h2 className='mb-4' style={{ position: 'relative' }}>Lista de Fornecedores
        <FaQuestionCircle
          className="tooltip-icon"
          onClick={toggleTooltip}
          // onMouseOver={toggleTooltip}
          // onMouseOut={toggleTooltip}
        />
        {tooltipAberto && (<div className="tooltip">
          Aqui você pode ver, editar ou excluir fornecedores do sistema.
        </div>
        )}
      </h2>
      
      <Link to="/add-fornecedores" className="btn btn-primary mb-2">
      <FaPlus className="icon" /> Adicionar Fornecedor</Link>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {
            fornecedores.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td>{fornecedor.nome}</td>
                <td>{fornecedor.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}</td>
                <td>{fornecedor.email}</td>
                <td>
                  <Link to={`/edit-fornecedores/${fornecedor.id}`} className="btn btn-sm btn-warning">
                    <FaEdit className="icon icon-btn"/>Editar
                  </Link>
                  <button onClick={() => abrirModal(fornecedor)} className="btn btn-sm btn-danger">
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
          <p>Você tem certeza que deseja remover o fornecedor&nbsp;
            <b>{fornecedorSelecionado && fornecedorSelecionado.nome}</b>?
          </p>
          <div className='modalButtons'>
            <button onClick={fecharModal} className='btn btn-secondary'>Não</button>
            <button onClick={removerFornecedor} className='btn btn-danger'>Sim</button>
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
          <h2>Fornecedor excluído com sucesso!</h2>
        </div>

      </Modal>
      
    </div>
  )
}

export default FornecedorList