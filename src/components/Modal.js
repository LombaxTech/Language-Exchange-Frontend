import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Modal = ({ show, setShow, children }) => (
    <Transition
        show={show}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
    >
        <Dialog
            open={show}
            onClose={() => setShow(false)}
            className="fixed inset-0  flex justify-center items-center"
        >
            <Dialog.Overlay className="fixed inset-0 bg-white opacity-70 z-10" />
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="w-full max-w-md h-1/2   overflow-hidden  z-20 bg-dark text-white shadow-xl rounded-2xl flex flex-col ">
                    {children}
                </div>
            </Transition.Child>
        </Dialog>
    </Transition>
);

export default Modal;
