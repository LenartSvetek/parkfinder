interface button extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children : React.ReactNode
}

export default function Button({children, ...props } : button) {
     return <button {...props}>{children}</button>
}