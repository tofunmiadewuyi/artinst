export type ButtonProps = {
    label: string
    action: () => void
    state: string
}

export const FilledButton = ({label, action}: ButtonProps) => {
    return(
        <button 
            onClick={() => action()}
            className="bg-cream px-5 py-3 text-xl font-medium text-coffee rounded-2xl w-max hover:bg-white hover:scale-105 transition duration-300">
            {label}
        </button>
    )
}

export const OutlineButton = ({label, action}: ButtonProps) => {
    return (
        <button 
            onClick={() => action()}
            className='text-white text-sm px-3 py-2 rounded-lg border border-cream/10 hover:bg-cream/5 hover:scale-105 hover:text-cream transition duration-100 ease-out'>
            {label}
        </button>
    )
}

export const OutlineButtonWithIconBefore = ({label, action, state}: ButtonProps) => {
    if(state === 'disabled') {
        //disabled
        return (
            <button 
                // onClick={() => action()}
                className='text-white/40 bg-cream/5 text-sm px-3 py-2 rounded-lg border border-cream/10 hover:cursor-default'>
                <span>{`<-`}</span>  {label}
            </button>
        )
    }  else {
        //default 
        return (
            <button 
                onClick={() => action()}
                className='text-white text-sm px-3 py-2 rounded-lg border border-cream/10 hover:bg-cream/10 hover:scale-105 hover:text-cream transition duration-100 ease-out'>
                <span>{`<-`}</span>  {label}
            </button>
        )
    }
    
}

export const OutlineButtonWithIconAfter = ({label, action, state}: ButtonProps) => {
    if(state === 'disabled') {
        //disabled
        return (
            <button 
                // onClick={() => action()}
                className='text-white/40 bg-cream/5 text-sm px-3 py-2 rounded-lg border border-cream/10 hover:cursor-default'>
                {label}  <span>{`->`}</span> 
            </button>
        )
    }  else {
        //default 
        return (
            <button 
                onClick={() => action()}
                className='text-white text-sm px-3 py-2 rounded-lg border border-cream/10 hover:bg-cream/10 hover:scale-105 hover:text-cream transition duration-100 ease-out'>
                {label}  <span>{`->`}</span> 
            </button>
        )
    }
}

export const TextButton = ({label, action}: ButtonProps) => {
    return (
        <button onClick={() => action()} 
            className=' underline underline-offset-4  w-fit hover:no-underline hover:text-cream hover:-translate-y-[2px] transition ease-out'>
            {label}
        </button>
    )
}

export const TextButtonWithIconBefore = ({label, action, state}: ButtonProps) => {
    return (
        <button onClick={() => action()} 
            className=' underline underline-offset-4 w-fit hover:no-underline hover:text-cream hover:-translate-y-[2px] transition ease-out'>
            <span>{`<-`}</span>  {label}
        </button>
    )
}
