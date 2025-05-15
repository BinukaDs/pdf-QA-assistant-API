import { motion } from "motion/react"

const QuestionBox = ({ text }: { text: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
            }}
            className='rounded-xl bg-gray-100 py-3 px-5 max-w-3/4 md:max-w-1/3 justify-self-end'>
            {text}
        </motion.div>
    )
}

export default QuestionBox