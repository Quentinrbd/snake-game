import { useEffect, useRef } from "react"

const Canvas = props => {
    const ref = useRef()

    const draw = (context) => {
        context.fillStyle = 'grey'
        context.fillRect(10,10,100,100)
    }

    useEffect(() => {
        const canvas = ref.current
        const context = canvas.getContext('2d')
        draw(context)
    })


     return <canvas ref={ref} {...props}/>
}
export default Canvas