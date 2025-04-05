import React, { useState, useEffect } from 'react'
import axios from '../../api'
import { FaCheckCircle, FaEdit, FaExclamationTriangle, FaPlus, FaQuestionCircle, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import  Modal from 'react-modal'

const ProdutoList = () => {

  const [produtos, setProdutos] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [tooltipAberto, setTooltipAberto] = useState(false)
  
  useEffect(() => {
    axios.get("/produtos")
    .then(response => setProdutos(response.data))
    .catch(error => console.error("Erro ao carregador a lista produtos: ", error))
  },[])

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setProdutoSelecionado(null)
  }

  const abrirModalSucesso = () => {
    setModalSucessoAberto(true)
    setTimeout(() => setModalSucessoAberto(false), 2000)
  }

  const removerProduto = () => {
    axios.delete(`/produtos/${produtoSelecionado.id}`)
    .then(() => {
      setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== produtoSelecionado.id))
      fecharModal()
      abrirModalSucesso()
    })
  }

  const toggleTooltip = () => {
    setTooltipAberto(!tooltipAberto) //Alternando o valor do tooltip
  }

  return (
    <div className='container mt-5'>
      <h2 className='mb-4' style={{ position: 'relative' }}>Lista de Produtos
        <FaQuestionCircle
          className="tooltip-icon"
          onClick={toggleTooltip}
          // onMouseOver={toggleTooltip}
          // onMouseOut={toggleTooltip}
        />
        {tooltipAberto && (<div className="tooltip">
          Aqui você pode ver, editar ou excluir produtos do sistema.
        </div>
        )}
      </h2>
      
      <Link to="/add-produtos" className="btn btn-primary mb-2">
      <FaPlus className="icon" /> Adicionar Produto</Link>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Descrição</th>
            <th>Qtd em Estoque</th>
            <th>Fornecedor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {
            produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{parseFloat(produto.preco).toFixed(2)}</td>
                <td>{produto.descricao}</td>
                <td>{produto.quantidadeEstoque}</td>
                {/* <td>{produto.fornecedor.nome}</td> */}
                <td>{produto.fornecedor.nome}</td>
                <td>
                  <Link to={`/edit-produtos/${produto.id}`} className="btn btn-sm btn-warning">
                    <FaEdit className="icon icon-btn"/>Editar
                  </Link>
                  <button onClick={() => abrirModal(produto)} className="btn btn-sm btn-danger">
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
          <p>Você tem certeza que deseja remover o produto&nbsp;
            <b>{produtoSelecionado && produtoSelecionado.nome}</b>?
          </p>
          <div className='modalButtons'>
            <button onClick={fecharModal} className='btn btn-secondary'>Não</button>
            <button onClick={removerProduto} className='btn btn-danger'>Sim</button>
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
          <h2>Produto excluído com sucesso!</h2>
        </div>

      </Modal>
      
    </div>
  )
}

export default ProdutoList