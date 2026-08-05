import type { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
}