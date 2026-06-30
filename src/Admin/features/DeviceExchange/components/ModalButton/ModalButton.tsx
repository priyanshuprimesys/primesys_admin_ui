import "../../../../../global/styles/GlobalCss.css";



interface ModalButtonProps {
  onHandleClick: () => void;
  icon?: JSX.Element;
  name?: string;
  response?: string;
}



const ModalButton: React.FC<ModalButtonProps> = ({ onHandleClick, icon, name, response }) => {
  return (
    <>
      {
        response != null
          ?
          response.length < 14 ?
            response
            :
            <div>
              <p>
                {
                  response.substring(0, 14)
                }...
                <button onClick={onHandleClick}
                  className="transition-all duration-100 ease-in rounded-full ripple hover:shadow-blackShadow"
                >
                  {
                    icon ?
                      icon
                      :
                      name ?
                        name
                        :
                        "Button"
                  }
                </button>
              </p>

            </div>

          :
          ''
      }
    </>

  )
}

export default ModalButton
