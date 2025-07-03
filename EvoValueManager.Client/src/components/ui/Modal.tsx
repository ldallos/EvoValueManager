import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-700">
                                <div className="flex items-center justify-between border-b border-slate-700 p-4">
                                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-white">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="rounded-md p-1 text-slate-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onClick={onClose}
                                    >
                                        <X className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}