import { ThreeElements } from '@react-three/fiber'

export { }

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [key: string]: any
        }
    }
}
