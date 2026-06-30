import { IconComponents } from "../../../../Icons/IconsStore";
import InputListStyle from '../styles/modules/InputListStyle.module.css';





interface InputSearchDataProps {
    placeHolder: string;
    data: any[] | null;
    dataProp: string;
}




export const InputSearchListData: React.FC<InputSearchDataProps> = ({ placeHolder, data, dataProp }) => {
    return (
        <div className="relative w-72 h-[70vh] my-2 bg-zinc-300 rounded  py-2">
            <div className="relative mb-3">
                <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                    {IconComponents.searchIcon}
                </div>
                <input type="search"
                    placeholder={placeHolder ? placeHolder : 'Search... '}
                    className="block w-full px-2 py-3 text-xs text-black bg-gray-200 border-2 border-gray-500 rounded-lg outline-none ps-10 focus:border-black"
                    required />
            </div>

            <div className={`max-h-full px-2 py-3  text-white rounded bg-theme-mutedBlue ${InputListStyle.dataList}`}>
                {
                    data ?
                        data.length > 0 ?

                            data.map((item, index) => (
                                <div key={index} className="px-1 py-1 cursor-pointer mb-1.5 rounded border-2">
                                    <span>
                                        {item[dataProp]}
                                    </span>
                                </div>
                            ))
                            :
                            <div className="flex items-center justify-center">
                                <p>Data not Available</p>
                            </div>
                        :
                        <div className="flex items-center justify-center">
                            <p>Data not Available</p>
                        </div>
                }
            </div>
        </div>

    )
}