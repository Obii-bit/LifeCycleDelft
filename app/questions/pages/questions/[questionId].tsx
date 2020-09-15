import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import getQuestion from "app/questions/queries/getQuestion"
import deleteQuestion from "app/questions/mutations/deleteQuestion"
import updateChoice from "app/choices/mutations/updateChoice"

export const Question = () => {
  const router = useRouter()
  const questionId = useParam("questionId", "number")
  const [question, { refetch }] = useQuery(getQuestion, { where: { id: questionId } })
  const handleVote = async (id, votes) => {
    try {
      const updated = await updateChoice({
        where: { id },
        data: { votes: votes + 1 },
      })
      refetch()
    } catch (error) {
      alert("Error creating question " + JSON.stringify(error, null, 2))
    }
  }

  return (
    <div>
      <h1>{question.text}</h1>
      <ul>
        {question.choices.map((choice) => (
          <li key={choice.id}>
            {choice.text} - {choice.votes} votes
            <button onClick={() => handleVote(choice.id, choice.votes)}>Vote</button>
          </li>
        ))}
      </ul>

      <Link href="/questions/[questionId]/edit" as={`/questions/${question.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteQuestion({ where: { id: question.id } })
            router.push("/questions")
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

const ShowQuestionPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Question</title>
      </Head>

      <main>
        <p>
          <Link href="/questions">
            <a>Questions</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <Question />
        </Suspense>
      </main>
    </div>
  )
}

ShowQuestionPage.getLayout = (page) => <Layout title={"Question"}>{page}</Layout>

export default ShowQuestionPage
