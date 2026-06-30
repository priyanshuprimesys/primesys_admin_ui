

interface CommandInfoModal {
  command: string;
}



const CommandInfo: React.FC<CommandInfoModal> = ({ command }) => {



  return (
    <>
      {
        command != null ?
          <textarea
            value={command}
            readOnly
            cols={20}
            rows={1}
            className="py-0.5 border-2 text-center border-black rounded px-0.5">

          </textarea>
          :
          ''
      }

    </>
  )
}

export default CommandInfo
