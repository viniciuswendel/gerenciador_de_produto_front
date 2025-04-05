import axios from '../../api'
import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask'
import Modal from 'react-modal'

const FornecedorForm = () => {

  const [fornecedor, setFornecedor] = useState({
    nome: '',
    cnpj: '',
    email: '',
    tipoFornecedor: 'COMUM', //Valor padrão inicial
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil' //Valor padrão inicial
    }
  })

  const [tooltipAberto, setTooltipAberto] = useState(false)
  const [mensagensErro, setMensagensErro] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [modalErroAberto, setModalErroAberto] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      //Preparando a edição, obtendo o fornecedor que eu quero editar.
      axios.get(`/fornecedores/${id}`)
      .then(response => setFornecedor(response.data))
      .catch(error => console.error("Ocorreu um erro: ", error))
    } else {
      //Se não houver id, redefine o estado para adicionar um NOVO fornecedor
      setFornecedor({
        nome: '',
        cnpj: '',
        email: '',
        tipoFornecedor: 'COMUM', //Valor padrão inicial
        endereco: {
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          pais: 'Brasil' //Valor padrão inicial
        }
      })
    }
  }, [id])

  const toggleTooltip = () => {
    setTooltipAberto(!tooltipAberto)
  }

  const handleCepChange = (e) => {
    const cep = e.target.value.replace(/\D/g, '') //Remove caracteres não numéricos do CEP

    setFornecedor({
      ...fornecedor,
      endereco: {...fornecedor.endereco, cep: e.target.value}
    })

    if (cep.length === 8) {
      //Buscar o endereço com a API ViaCEP se o CEP tiver 8 dígitos
      axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => {
        if (!response.data.erro) { //Se não tiver erro na response...
          setFornecedor(prevFornecedor => ({
            ...prevFornecedor,
            endereco: {
                ...prevFornecedor.endereco,
                logradouro: response.data.logradouro,
                bairro: response.data.bairro,
                cidade: response.data.localidade,
                estado: response.data.uf
            }
        }))
      }
    })
      .catch(error => console.error("Erro ao buscar CEP: ", error))
    }
  }

  // É a função que envia os dados do form para o backend
  const handleSubmit = (event) => {
    event.preventDefault() //Previne o comportamento de recarregar a página
    setMensagensErro([]) //Limpa mensagens de erro anteriores

    //Remover a pontuação do CNPJ antes de enviar para o backend
    const fornecedorData = {
      ...fornecedor,
      cnpj: fornecedor.cnpj.replace(/[^\d]/g, '') //Remove caracteres não numéricos
    }

    //Determinar se a requisição será PUT (edição) ou POST (criação)
    const request = id ? axios.put(`/fornecedores/${id}`, fornecedorData)
    : axios.post('/fornecedores', fornecedorData)
    request.then(() => setModalAberto(true))
    .catch(error => {
      if (error.response && error.response.status === 500) {
        setMensagensErro(["Erro interno do servidor, entre em contato com o suporte."])
        setModalErroAberto(true)
      } else if (error.response && error.response.data) {
        setMensagensErro(Object.values(error.response.data))
        setModalErroAberto(true)
      } else {
        console.error("Ocorreu um erro: ", error)
      }
    })

  }

  const fecharModal = () => {
    setModalAberto(false)
    navigate("/listar-fornecedores")
  }

  const fecharModalErro = () => {
    setModalErroAberto(false)
  }

  const adicionarOutroFornecedor = () => {
    setModalAberto(false)
    setFornecedor({
      nome: '',
      cnpj: '',
      email: '',
      tipoFornecedor: 'COMUM', //Valor padrão inicial
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: 'Brasil' //Valor padrão inicial
      }
    })
  }

  return (
    <div className="form-container">
      <h2 style={{ position: 'relative' }}>
        { id ? 'Editar Fornecedor' : 'Adicionar Fornecedor' }
        <FaQuestionCircle
          className="tooltip-icon"
          onClick={toggleTooltip}
          // onMouseOver={toggleTooltip}
          // onMouseOut={toggleTooltip}
        />
        {tooltipAberto && (
          <div className="tooltip">
            {
              id ? 'Nesta tela, você pode editar as informações de um fornecedor existente.'
              : 'Nesta tela, você pode adicionar um novo fornecedor ao sistema.'
            }
          </div>
        )}
      </h2>

      <form className="fornecedor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome do fornecedor</label>
          <input
            type="text"
            className="form-control"
            id="nome"
            name="nome"
            value={fornecedor.nome}
            placeholder="Digite o nome do fornecedor"
            onChange={e => setFornecedor({...fornecedor, nome: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cnpj">CNPJ do fornecedor</label>
          <InputMask
            mask="99.999.999/9999-99"
            className="form-control"
            id="cnpj"
            name="cnpj"
            value={fornecedor.cnpj}
            placeholder="Digite o CNPJ do fornecedor"
            onChange={e => setFornecedor({...fornecedor, cnpj: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail do fornecedor</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            placeholder="Digite o email do fornecedor"
            title="Digite um email válido"
            value={fornecedor.email}
            onChange={e => setFornecedor({...fornecedor, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
            <label htmlFor="tipoFornecedor">Tipo de Fornecedor</label>
                <select
                    className="form-control"
                    id="tipoFornecedor"
                    name="tipoFornecedor"
                    value={fornecedor.tipoFornecedor}
                    onChange={e => setFornecedor({ ...fornecedor, tipoFornecedor: e.target.value })}
                    required
                >
                    <option value="COMUM">COMUM</option>
                    <option value="PREMIUM">PREMIUM</option>
                </select>
            </div>
            {/* Campos de endereço */}
            <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <InputMask
                    mask="99999-999"
                    className="form-control"
                    id="cep"
                    name="cep"
                    value={fornecedor.endereco.cep}
                    placeholder="CEP"
                    onChange={handleCepChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="logradouro">Logradouro</label>
                <input
                    type="text"
                    className="form-control"
                    id="logradouro"
                    name="logradouro"
                    value={fornecedor.endereco.logradouro}
                    placeholder="Rua"
                    onChange={e => setFornecedor({
                        ...fornecedor, endereco: { ...fornecedor.endereco, logradouro: e.target.value }
                        })}
                    required
                  />
                </div>
                <div className="form-group">
                    <label htmlFor="numero">Número</label>
                    <input
                        type="text"
                        className="form-control"
                        id="numero"
                        name="numero"
                        value={fornecedor.endereco.numero}
                        placeholder="Número"
                        onChange={e => setFornecedor({
                            ...fornecedor,
                            endereco: { ...fornecedor.endereco, numero: e.target.value }
                        })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="complemento">Complemento</label>
                    <input
                        type="text"
                        className="form-control"
                        id="complemento"
                        name="complemento"
                        value={fornecedor.endereco.complemento}
                        placeholder="Complemento"
                        onChange={e => setFornecedor({
                            ...fornecedor,
                            endereco: { ...fornecedor.endereco, complemento: e.target.value }
                        })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bairro">Bairro</label>
                    <input
                        type="text"
                        className="form-control"
                        id="bairro"
                        name="bairro"
                        value={fornecedor.endereco.bairro}
                        placeholder="Bairro"
                        onChange={e => setFornecedor({
                            ...fornecedor,
                            endereco: { ...fornecedor.endereco, bairro: e.target.value }
                        })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cidade">Cidade</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cidade"
                        name="cidade"
                        value={fornecedor.endereco.cidade}
                        placeholder="Cidade"
                        onChange={e => setFornecedor({
                            ...fornecedor,
                            endereco: { ...fornecedor.endereco, cidade: e.target.value }
                        })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <input
                        type="text"
                        className="form-control"
                        id="estado"
                        name="estado"
                        value={fornecedor.endereco.estado}
                        placeholder="Estado"
                        onChange={e => setFornecedor({
                            ...fornecedor,
                            endereco: { ...fornecedor.endereco, estado: e.target.value }
                        })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pais">País</label>
                    <input
                        type="text"
                        className="form-control"
                        id="pais"
                        name="pais"
                        value={fornecedor.endereco.pais}
                        onChange={e => setFornecedor({
                            ...fornecedor,
                            endereco: { ...fornecedor.endereco, pais: e.target.value }
                        })}
                        required
                    />
                </div>

                <button type="submit" className="btn-success">
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
           <FaCheckCircle className="icon successIcon" />
           <h2>{ id ? 'Fornecedor atualizado com sucesso' : 'Fornecedor adicionado com sucesso' }</h2>
           <div className="modalButtons">
             <button onClick={fecharModal} className="btn-success">Fechar</button>
             { !id && <button onClick={adicionarOutroFornecedor} className="btn-secondary">Adicionar outro fornecedor</button> }
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
            mensagensErro.map((mensagem, index)=> (
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

export default FornecedorForm