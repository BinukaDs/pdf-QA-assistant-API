import './App.css'
import { Button } from "@/components/ui/button"
import { Input } from './components/ui/input'
import QuestionBox from './components/responses/question'
import AnswerBox from './components/responses/answer'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Tailspin } from 'ldrs/react'
import { Helmet } from 'react-helmet';
import 'ldrs/react/Tailspin.css'

interface responseDataTypes {
  id?: number
  question: string
  answer?: string
}
function App() {

  const responsesRef = useRef<responseDataTypes[]>(
    [
      {
        id: 0,
        question: "What is the purpose of this document?",
        answer: "The purpose of this document is to provide an overview of the project and its objectives."
      }
    ]
  )
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [Loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(true);
  const BASE = import.meta.env.VITE_API_ADDRESS;
  const [isVisible, setIsVisible] = useState<boolean>();
  const visibleRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: 0.1
    })
    console.log(isVisible)
    if (visibleRef.current) {
      observer.observe(visibleRef.current);
    }

    return () => {
      if (visibleRef.current) {
        observer.unobserve(visibleRef.current);
      }
    };

  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);

    // console.log("Response without answer: ", responsesRef.current);
    if (userQuestion != "") {

      responsesRef.current = [
        ...responsesRef.current,
        {
          id: responsesRef.current.length,
          question: userQuestion,
        }
      ]

      setUserQuestion('');

      await axios.post(`${BASE}/embeddings/search/`, {
        userQuestion: userQuestion
      }).then((res) => {
        console.log(res.data);

        responsesRef.current[responsesRef.current.length - 1] = {
          ...responsesRef.current[responsesRef.current.length - 1],
          answer: res.data.answer
        }

        

        setLoading(false);
        // console.log("Responses with answer: ", responsesRef.current);

      }).catch((err) => {
        console.log(err);
        setLoading(false);
      });
    }
    else {
      console.log('Please enter a question');
      setLoading(false);
    }
  }

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuestion(e.target.value);
    if (e.target.value != "" && e.target.value.length >= 2) {
      setStatus(false);
    } else if (e.target.value.length <= 2) {
      setStatus(true);
    }
  }


  return (
    <>
      <Helmet>
        <title>DIMO AI Annual Report QA Reader</title>
        <meta name="description" content="DIMO AI Annual Report QA Reader" />
        <link rel="icon" type="image/x-icon" href="/dimo-favicon.ico" />
        <link rel="apple-touch-icon" href="/dimo-favicon.ico" />

      </Helmet>
      <section className=' flex flex-col h-screen'>

        <div className='flex p-4 px-2 md:px-16 top-0 fixed bg-gray-50 w-full rounded-b-xl items-center gap-3 justify-between'>
          <img src="/dimo-logo.svg" width={"120px"} alt="Logo" />
          <h1 className='text-xl font-bold'>AI PDF Q&A Reader</h1>
        </div>

        <section ref={visibleRef} className='w-full container mx-auto md:px-0 px-6 py-32'>
          {responsesRef && responsesRef.current.map((response: responseDataTypes) => {
            return (
              <div className='grid justify-items-stretch my-5' key={responsesRef.current.indexOf(response)}>
                <QuestionBox text={response.question}></QuestionBox>
                {response.answer && response.answer != "" && <AnswerBox text={response.answer}></AnswerBox>}
              </div>
            )
          })}
        </section>

        <form className='flex mt-3 justify-center items-end  w-full gap-3 bottom-0 py-7 px-2 md:px-16 bg-gray-50 rounded-t-xl fixed'>
          <Input value={userQuestion} disabled={Loading} onChange={handleUserInput} name="userQuestion" id="userQuestion" className='w-full text-sm p-6 rounded-full' placeholder='Ask a question about the PDF...' />
          <Button disabled={Loading || status} onClick={handleSubmit} className='mt-3 rounded-full p-5'>{Loading ?
            <Tailspin
              size="20"
              stroke="5"
              speed="0.9"
              color="white"
            /> : <img width="18" height="18" src="https://img.icons8.com/fluency-systems-regular/48/ffffff/right--v1.png" alt="right--v1" />}</Button>
        </form>

      </section>
    </>
  )
}


export default App
