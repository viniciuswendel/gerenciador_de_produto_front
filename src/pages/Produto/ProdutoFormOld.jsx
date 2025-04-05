import axios from '../../api'
import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from 'react-modal'

const ProdutoFormOld = () => {

  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    descricao: '',
    quantidadeEstoque: ''
  })

  const [tooltipAberto, setTooltipAberto] = useState(false)
  const [mensagensErro, setMensagensErro] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [modalErroAberto, setModalErroAberto] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      // Preparando a edição, obtendo o produto que eu quero editar
      axios.get(`/produtos/${id}`)
      .then(response => setProduto(response.data))
      .catch(error => console.error("Ocorreu um erro: ", error))
    } else {
      // Se não houver id, redefine o estado par adicionar um NOVO produto
      setProduto({
        nome: '',
        preco: '',
        descricao: '',
        quantidadeEstoque: ''
      })
    }
  },[id])

  const toggleTooltip = () => {
    setTooltipAberto(!tooltipAberto)
  }

  const handleSubmit = (event) => {
    event.preventDefault() //Previne o comportamento de recarregar a página
    setMensagensErro([]) //Limpa mensages de erro anteriores
  }

  // Determina se a requisição será PUT ou POST
  const request = id ? axios.put(`/produtos/${id}`)
  : axios.post('/produtos')
  request.then(() => setModalAberto(true))
  .catch(error => {
    if (error.response && error.response.status === 500) {
      setMensagensErro(["Erro interno do servidor, entre em contato com o suporte."])
      setModalErroAberto(true)
    } else if (error.response && error.response.data) {
      setMensagensErro(Object.values(error.response.data))
      setModalAberto(true)
    } else {
      console.error("Ocorreu um erro: ", error)
    }
  })

  const fecharModal = () => {
    setModalAberto(false)
    navigate("/listar-produtos")
  }

  const fecharModalErro = () => {
    setModalErroAberto(false)
  }

  const adicionarOutroProduto = () => {
    setModalAberto(false)
    setProduto({
        nome: '',
        preco: '',
        descricao: '',
        quantidadeEstoque: ''
      })
  }

  return (
    <div className="form-container">
      <h2 style={{ position: 'relative' }}>
        { id ? 'Editar Produto' : 'Adicionar Produto' }
        <FaQuestionCircle
          className="tooltip-icon"
          onMouseOver={toggleTooltip}
          onMouseOut={toggleTooltip}
        />
        {toggleTooltip && (
          <div className="tooltip">
            {
              id ? 'Nesta tela, você pode editar as informações de um produto existente.'
              : 'Nesta tela, você pode adicionar um novo produto ao sistema.'
            }
          </div>
        )}
      </h2>

        <form className="produto-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome do Produto</label>
            <input
              type="text"
              className="form-control"
              id="nome"
              name="nome"
              value={produto.nome}
              placeholder="Digite o nome do produto"
              onChange={e => setProduto({...produto, nome: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="preco">Preço do Produto</label>
            <input
              type="text"
              className="form-control"
              id="preco"
              name="preco"
              placeholder="Digite o valor do produto"
              value={produto.preco}
              onChange={e => setProduto({...produto, preco: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descricao">Descrição do Produto</label>
            <input
              type="text"
              className="form-control"
              id="descricao"
              name="descricao"
              placeholder="Digite a descrição do produto"
              value={produto.descricao}
              onChange={e => setProduto({...produto, descricao: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="qtdEstoque">Quantidade em Estoque</label>
            <input
              type="text"
              className="form-control"
              id="qtdEstoque"
              name="qtdEstoque"
              placeholder="Digite a quantidade em estoque do produto"
              value={produto.quantidadeEstoque}
              onChange={e => setProduto({...produto, quantidadeEstoque: e.target.value})}
              required
            />
          </div>

        <button className="btn-success">
          {id ? 'Editar' : 'Adicionar'}
        </button>
        </form>

        {/* Modal de sucesso */}
        <Modal
          isOpen={modalAberto}
          onRequestClose={fecharModal}
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modalContent">
            <FaCheckCircle className="icon successIcon"/>
            <h2>{ id ? 'Produto atualizado com sucesso' : 'Produto adicionado com sucesso' }</h2>
            <div className="modalButtons">
              <button className="btn-success">Fechar</button>
              { !id && <button onClick={adicionarOutroProduto}  className="btn-secondary">Adicionar outro produto</button> }
            </div>
          </div>
        </Modal>

        {/* Modal de erro */}
        <Modal
          isOpen={modalErroAberto}
          onRequestClose={fecharModalErro}
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modalContent">
            <FaExclamationTriangle className="icon errorIcon"/>
            <h2>Ocorreu um ou mais erros:</h2>
            {
              mensagensErro.map((mensagem, index) => (
                <h4 key={index}>{mensagem}</h4>
              ))
            }
            <br/>
            <button className="btn-secondary" onClick={fecharModalErro}>Fechar</button>
          </div>

        </Modal>

    </div>
  )
}

export default ProdutoFormOld