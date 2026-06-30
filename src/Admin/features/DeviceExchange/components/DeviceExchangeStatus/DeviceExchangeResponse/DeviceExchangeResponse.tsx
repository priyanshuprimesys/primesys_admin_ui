import { useContext } from "react"
import { DeviceExchangeResponseContext } from "../../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeResponseContext/DeviceExchangeResponseContext"





const DeviceExchangeResponse = () => {

  const {exchangeDataResponse}  = useContext(DeviceExchangeResponseContext);
  

  return (
    <div className="h-full px-1 py-1 border-2 border-gray-800 max-h-48 dataScroll">
      {
        exchangeDataResponse.data.result.split('\n').map(sentence => sentence.trim()).filter(sentence => !sentence.includes('Error:')).map((sentence,index)=>(
          <p className="font-medium text-green-700" key={index}>{sentence}</p>
        ))
      }
      <hr style={{ paddingTop:'1px',paddingBottom:'1px',background:'black' }} />
      {
        exchangeDataResponse.data.result.split('\n').map(sentence => sentence.trim()).filter(sentence => sentence.includes('Error:')).map((sentence,index)=>(
          <p className="font-semibold text-red-700" key={index}> {sentence}</p>
        ))
      }
     
    </div>
  )
}

export default DeviceExchangeResponse
