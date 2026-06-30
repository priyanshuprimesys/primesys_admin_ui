import "../../../../global/styles/GlobalCss.css"


interface ModalButtonProps {
  onHandleClick: () => void;
  icon?: JSX.Element;
  name?: string;
  dataPacket?: string;
}



const MoreInfoButton: React.FC<ModalButtonProps> = ({ onHandleClick, icon, name, dataPacket }) => {
  return (
    <>
      {
        dataPacket != null
          ?
          dataPacket.length < 100 ?
          dataPacket
            :
            <div>
              <p className="break-all">
                {
                  dataPacket.substring(0, 100)
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

export default MoreInfoButton
