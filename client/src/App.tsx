import { useAccount, useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import { ContractData } from "./config/ContractData";
import { useEffect, useRef, useState } from "react";
import { useConnect, } from 'wagmi'
import { metaMask } from "wagmi/connectors";
import { toast } from "react-toastify";
import Loader from "./components/Loader";
import ETH from "./assets/eth.svg"
import Popup from "reactjs-popup";
import Detail from "./components/Detail";
interface Entity {
  field: string;
  value: string
}
const App = () => {
  const CHAINID = 11155111;
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [editDetails, setEditDetails] = useState<Entity | null>(null)
  const { connect } = useConnect()
  const [entityDetails, setEntityDetails] = useState<Entity[]>([])
  const { switchChain, isError: errorSwitching } = useSwitchChain()
  const { writeContract, isPending, isError, error, isSuccess } = useWriteContract()
  const { isConnected, address, chain } = useAccount()
  const [loading, setLoading] = useState<boolean>(true)
  const contractAddress = import.meta.env.VITE_REACT_APP_CONTRACT_ADDRESS as `0x${string}`;
  const editInputRef = useRef<HTMLInputElement>(null)
  const [networkDialog, setNetworkDialog] = useState<boolean>(false);

  if (isError) {
    toast.error(error?.name)
  }

  if (errorSwitching) {
    switchChain({ chainId: CHAINID })

  }




  if (isSuccess) {
    toast.success("Awaiting confirmation")

  }
  function submit() {

    if (!editDetails) return;
    if (!editInputRef.current?.value.trim().length) return;
    if (!isConnected) {
      toast.error("Connect wallet");
      return;
    }
    if (!chain || chain.id !== CHAINID) {
      switchChain({ chainId: CHAINID })
      return;
    }
    writeContract({
      address: contractAddress,

      abi: ContractData.abi,
      functionName: `update${editDetails.field}`,
      args: [editInputRef.current?.value],

    })
    editInputRef!.current!.value = "";

    setOpenEditModal(false);

  }

  const { data } = useReadContract({
    address: contractAddress,
    abi: ContractData.abi,
    functionName: "getEntityDetails",
    query: {
      refetchInterval: 1000,
      retry: true
    }
  });


  useEffect(() => {
    if (data) {
      setLoading(false);
      const jsonData: Entity[] = [
        {
          field: "Name",
          value: (data as any[])[0]
        },
        {
          field: "Age",
          value: (data as any[])[1].toString()
        },
        {
          field: "Address",
          value: (data as any[])[2]
        },
        {
          field: "Location",
          value: (data as any[])[3]
        },
      ]

      setEntityDetails(jsonData);
      return;
    }




  }, [data])

  useEffect(() => {
    if (!chain || chain.id !== CHAINID) {
      if (isConnected) {
        setNetworkDialog(true)
      }
    }
  }, [chain])




  return (
    <div>
      <Popup closeOnDocumentClick={false} open={networkDialog} closeOnEscape={false}>
        <div className="flex items-center justify-center">
          <div className="md:w-[calc(100vw/4)] w-full">
            {/* <div className="bg-[rgba(0,0,0,.8)]  w-full h-full p-5 rounded-xl "> */}
            <div className="flex w-full items-center   justify-center">
              <div className="w-full bg-white p-5 rounded-3xl  border-[1.563px] border-[#383838]">
                <h1 className="font-[800] text-4xl">Notice!!!</h1>
                <p>Switch To the sepolia test network</p>
                <button
                  onClick={() => {
                    setNetworkDialog(false);
                    switchChain({ chainId: CHAINID })

                  }}
                  className="bg-gradient-to-l mt-5 outline-none w-full from-[#3F26D9] via-[#3F26D9] to-[#8A3FE7] text-white font-bold py-2.5 px-4 rounded-lg"
                >
                  Switch
                </button>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </Popup>

      <Popup onClose={() => setOpenEditModal(false)} overlayStyle={{ background: "rgba(0,0,0,.3)" }} open={openEditModal}>
        <div className="bg-white p-5 w-[calc(100vw/3)] rounded-xl shadow-2xl ">
          <h1 className="text-xl text-center border-b-[1px] text-[#333] pb-1">Edit {editDetails?.field}</h1>

          <form onSubmit={(e) => {
            e.preventDefault();
            submit();
          }} className="mt-10">
            <div className="">
              <input defaultValue={editDetails?.value} ref={editInputRef} type="text" placeholder="edit..." className="w-full p-3 rounded-lg outline-none border-[1px] " name="" id="" />
            </div>

            <div className="flex items-center justify-end">
              <button type="submit" disabled={isPending} className="bg-gradient-to-l from-[#3F26D9] via-[#3F26D9] to-[#8A3FE7] text-sm text-white py-3 px-10 w-full mt-5 rounded-lg" onClick={() => {

              }}>{isPending ? <Loader size="w-4 h-4" color="fill-white" /> : "Submit"}</button>
            </div>
          </form>
        </div>
      </Popup>

      <nav className="fixed top-0 w-full z-50 shadow-lg py-3">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">

            <h2 className="text-xl font-[600] text-[#666]">Simple Registry</h2>
          </div>
          <div className="">
            {isConnected ? <div className=" shadow-lg bg-white rounded-full py-3 px-5">


              <div onClick={async () => {
                await navigator.clipboard.writeText(address!.toString())
                toast.success("Copied address to clipboard")
              }} className="flex cursor-pointer items-center gap-2">
                <img src={ETH} className="w-5 h-5" alt="" />
                <small>{`${chain?.name} ${address?.slice(0, 7)}...${address?.slice(address.length - 5)}`}</small>
              </div>

            </div> : <button className="bg-gradient-to-l from-[#3F26D9] via-[#3F26D9] to-[#8A3FE7] text-sm text-white p-3 rounded-full" onClick={() => {
              connect({ connector: metaMask(), chainId: CHAINID });

            }}>Connect wallet</button>}

          </div>
        </div>
      </nav>


      <div className="min-h-screen h-full flex  items-center justify-center ">
        <div className={`bg-white w-1/2 shadow-2xl p-5 rounded-lg ${loading ? "h-80" : ""}`}>
          <h1 className="text-2xl text-center border-b-[1px]">Entity Details</h1>
          {loading ? <div className="flex h-80 items-center justify-center">
            <Loader />
          </div> : null}
          {
            entityDetails.map((entity, index) => {
              return <Detail key={index} onEdit={(field: string, value: string) => {
                setEditDetails({ field, value });
                setOpenEditModal(true);
              }} title={entity.field} value={entity.value} />
            })
          }


        </div>
      </div>

    </div>
  );
};

export default App;
