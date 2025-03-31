import { FunnelIcon } from "@heroicons/react/20/solid";

interface DropdownProps {
    text: string;
    backgroundColor: string;
    textColor: string;
}

export default function Dropdown({ text, backgroundColor, textColor }: DropdownProps) {
    return (
        <div className={`flex h-full w-full items-center justify-between ps-5 pe-5 ${backgroundColor} ${textColor} rounded-4xl font-bold cursor-pointer`}>
            <div>{text}</div>
            <FunnelIcon
                aria-hidden="true"
                className="-mr-1 size-5 textLight"
            />
        </div>
    )
}