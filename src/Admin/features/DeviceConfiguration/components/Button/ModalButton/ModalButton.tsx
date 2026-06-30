import "../../../../../../global/styles/GlobalCss.css";



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
          response.length < 150 ?
            response
            :
            <div>
              <p className="m-0 break-all">
                {
                  response.substring(0, 160)
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
