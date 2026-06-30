import PrivacyData from "../../../../data/PrivacyPolicyData/PrivacyPolicyTerm.json";




const Model = () => {
    return (
        <div className="px-4 py-4">
            <div className="py-4 text-center bg-gray-300">
                <h1 className="text-4xl font-bold">
                    Privacy Policy
                </h1>
                <span className="font-mono text-sm">Primesys Technology</span>
            </div>
            {
                PrivacyData.map((item, index) => (
                    <div key={index}>
                        <div>
                            <div className="flex gap-2 py-2">
                                <h1 className="font-bold">{item.id}</h1>
                                <p className="m-0 text-base font-semibold">{item.title}</p>
                            </div>
                            <div className="px-6 text-justify">
                                <p>{item.term}</p>
                            </div>
                            <div>
                                {item.subTerm?.map((sub, index) => (
                                    <div key={index} className="px-4 py-1">
                                        <div className="flex gap-2 text-justify">
                                            <h3 className="font-semibold">{sub.id}</h3>
                                            <p>{sub.term}</p>
                                        </div>

                                        {
                                            sub.subTerm?.map((sub, index) => (
                                                <div key={index} className="flex gap-2 px-6">
                                                    <h4 className="font-semibold">{sub.id}</h4>
                                                    <p>{sub.term}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Model
