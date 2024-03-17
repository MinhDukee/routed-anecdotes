/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate
} from 'react-router-dom'
import {useField} from './hooks/index'


const Menu = (props) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">about</Link>
          <Link style={padding} to="/create">create new</Link>
          <Link style={padding} to="/anecdotes">anecdotes</Link>
        </div>

        <Routes>
          <Route path="/create" element={<CreateNew addNew={props.addNew} />} />
          <Route path="/" element={<About />} />
          <Route path="/anecdotes" element={<AnecdoteList anecdotes={props.anecdotes} notification = {props.notification} />      } />
          <Route path="/anecdotes/:id" element={<Anecdote anecdotes={props.anecdotes} />      } />
        </Routes>
      </Router>
      </div>
  )
}

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find(n => n.id === Number(id)) 
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>votes: {anecdote.votes}</div>
    </div>
  )
}

const AnecdoteList = ({ anecdotes, notification }) => (
  <div>
    <h2>Anecdotes</h2>

    {notification
            ?    <p>"{notification.content}" by {notification.author} has been created.</p>
            : null
          }

    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>)}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.input.value,
      author: author.input.value,
      info: info.input.value,
      votes: 0
    })
    navigate('/anecdotes')
    
  }


  
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>

        content: 
        <input  {...content.input} /> 
        <br/> 
        author: 
        <input {...author.input} />
        <br /> 
        url for more info:
        <input {...info.input} />

        <button type = "submit">create</button>

        <button onClick={() => {
          content.reset()
          author.reset()
          info.reset()
        }} type = "reset"> reset </button> 
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(anecdote)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu addNew = {addNew} anecdotes = {anecdotes} notification = {notification}/>
      <Footer />
    </div>
  )
}

export default App
