import { Dialog, Transition } from "@headlessui/react";
import type { Dispatch, FC, ReactElement, SetStateAction } from "react";
import { Fragment } from "react";

export const Modal: FC<{
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  alertTitle: string;
  alertBody: ReactElement;
  buttons: {
    buttonText: string;
    buttonOnClick: () => void;
    buttonStyle?: string | undefined;
    buttonDisabled?: boolean;
    avoidModalClose?: boolean;
  }[];
}> = ({ modalOpen, setModalOpen, alertTitle, alertBody, buttons }) => {
  return (
    <Transition appear show={modalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          return;
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="overflow-hidden p-6 w-full max-w-md text-left align-middle bg-white rounded-2xl shadow-xl transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {alertTitle}
                </Dialog.Title>
                <div className="mt-2">
                  {alertBody}
                </div>

                <Fragment>
                  <div className="flex gap-2 mt-4">
                    {buttons.map((btn, n) => (
                      <button
                        key={n}
                        className={btn.buttonStyle
                          ? btn.buttonStyle
                          : "inline-flex justify-center py-2 px-4 text-sm font-medium text-[#05ce91] border border-[#05ce91] rounded-md hover:bg-green-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"}
                        onClick={() => {
                          btn.buttonOnClick();
                          !btn.avoidModalClose && setModalOpen(false);
                        }}
                        disabled={btn.buttonDisabled ? btn.buttonDisabled : false}
                      >
                        {btn.buttonText}
                      </button>
                    ))}
                  </div>
                </Fragment>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
