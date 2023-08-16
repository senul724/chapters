import { Dialog, Transition } from "@headlessui/react";
import { Form, Formik } from "formik";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { type Dispatch, Fragment, type SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomSelectComponent from "src/components/forms/custom-select-component";
import { CoinbaseIcon } from "src/components/icons/coinbase";
import { FortmaticIcon } from "src/components/icons/fortmatic";
import { MetamaskIcon } from "src/components/icons/metamask";
import type { AvailableWallets } from "src/types/web3";
import { getErrorMsg } from "~/data/error-list";
import { useSession } from "~/hooks/use-session";
import { api } from "~/utils/api";
import { onBoard } from "./on-board";
import { walletNotFound } from "./prompt-payload";

const Modal = dynamic(() =>
  import("src/components/utils/modal").then(
    (mod) => mod.Modal,
  )
);

export const ConnectWallet = (props: {
  connectWalletOpen: boolean;
  firstRender: boolean;
  setConnectWalletOpen: Dispatch<SetStateAction<boolean>>;
  setFirstRender: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    connectWalletOpen,
    firstRender,
    setConnectWalletOpen,
    setFirstRender,
    setLoading,
  } = props;

  const router = useRouter();
  const { refetch } = useSession();

  useEffect(
    () => {
      firstRender ? (setFirstRender(false), setLoading(false)) : null;
    },
    // eslint-disable-next-line
    [],
  );

  const [openNotFound, setOpenNotFound] = useState<boolean>(false);
  const [ongoing, setOngoing] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<AvailableWallets>("1");

  const { mutateAsync: loginIn } = api.auth.login.useMutation();

  const initialValues: { wallet: undefined | AvailableWallets } = {
    wallet: undefined,
  };

  const handleOnSubmit = async (values: { wallet: undefined | AvailableWallets }) => {
    const { wallet } = values;
    if (!wallet) {
      setOngoing(false);
      return toast.error(
        "Please select a wallet to get started",
        { id: "login" },
      );
    }
    setOngoing(true);
    const { account, token, walletFound } = await onBoard(wallet);

    toast.loading("logging in...", { id: "login" });
    if (!walletFound) {
      setSelectedWallet(wallet);
      setOpenNotFound(true);
      setOngoing(false);
      toast.dismiss();
      return;
    }

    if (!account || !token) {
      toast.error(getErrorMsg("sww"), { id: "login" });
      setConnectWalletOpen(false);
      return;
    }
    const state = await loginIn({ address: account, signature: token });
    if (state) {
      toast.success("successfully logged in!", { id: "login" });
      await router.push("/story");
      return;
    }
    toast.error("login failed!", { id: "login" });
    await refetch();
    setConnectWalletOpen(false);
  };

  return (
    <div>
      <Transition appear show={connectWalletOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            !ongoing && !openNotFound && setConnectWalletOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="overflow-y-auto fixed inset-0">
            <div className="flex justify-center items-center p-4 min-h-full text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="overflow-hidden p-6 w-full max-w-md text-left align-middle border border-[#ffc400] bg-black rounded-2xl shadow-xl transition-all transform">
                  <div className="mt-2">
                    <Formik
                      initialValues={initialValues}
                      onSubmit={handleOnSubmit}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <div className="p-4 rounded-xl sm:p-6">
                            <h5 className="mb-5 text-base font-semibold text-[#ffc400] md:text-xl">
                              Select wallet
                            </h5>
                            <ul className="my-4 space-y-3">
                              <li>
                                <CustomSelectComponent
                                  icon={<MetamaskIcon />}
                                  isPopular={true}
                                  name="wallet"
                                  label="MetaMask"
                                  value="1"
                                  type="radio"
                                />
                              </li>
                              <li>
                                <CustomSelectComponent
                                  icon={<FortmaticIcon />}
                                  isPopular={false}
                                  name="wallet"
                                  label="Fortmatic"
                                  value="2"
                                  type="radio"
                                />
                              </li>
                              <li>
                                <CustomSelectComponent
                                  icon={<CoinbaseIcon />}
                                  isPopular={false}
                                  name="wallet"
                                  label="Coinbase Wallet"
                                  value="3"
                                  type="radio"
                                />
                              </li>
                            </ul>
                            <button
                              type="submit"
                              className="py-1 mt-10 w-full text-2xl font-medium text-[#ffc400] rounded-xl hover:scale-105 border border-[#ffc400]"
                              disabled={isSubmitting}
                            >
                              <h3>Connect</h3>
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {openNotFound
        ? (
          <Modal
            modalOpen={openNotFound}
            setModalOpen={setOpenNotFound}
            buttons={walletNotFound(selectedWallet, router.route)}
            alertTitle={"Wallet not found"}
            alertBody={
              <p className="text-sm text-gray-500">
                Please download the wallet or open the mobile wallet if available. Paste the link in the app browser if
                and error occur.
                <br />
                Reload and retry if this is mistake.
              </p>
            }
          />
        )
        : null}
    </div>
  );
};
