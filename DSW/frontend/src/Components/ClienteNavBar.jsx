
const PerfilIcon = () =>{

  return(
    <div className='container-perfil'>

          <div class="icon-perfil"><img></img></div>
          <div class="name-perfil">Olá, </div>

          <div className="name-perfil">Olá,</div>
    </div>
  )

}

const ClienteNavBar = () => {
    return (
      <div className="containerLeft">

        <PerfilIcon></PerfilIcon>

        <div className='container-options'>

          <div class="options " >

            <div class="icon-options "><img></img></div>
            <div class="text-options">Início</div>

          </div>
  
          <div class="options " >

            <div class="icon-options "><img></img></div>
            <div class="text-options">Configurações</div>

          </div>    
  
          <div class="options " >

            <div class="icon-options "><img></img></div>
            <div class="text-options">Notificações</div>

          </div>

          <div className="separator-line"></div>

          <div class="options " >

            <div class="icon-options "><img></img></div>
            <div class="text-options">Pedidos</div>

          </div>

  
          <div className="separator-line line-bottom"></div>
  
          
          <div class="options sair" >

            <div class="icon-options "><img></img></div>
            <div class="text-options">Sair</div>

          </div>
          
  
          <div className="direitos bottom">
            Todos os direitos reservados ©
          </div>
        </div>
      </div>
    );
  };

  export default ClienteNavBar;