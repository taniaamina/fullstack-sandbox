import React, { Fragment, useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ReceiptIcon from '@material-ui/icons/Receipt'
import Typography from '@material-ui/core/Typography'
import { ToDoListForm } from './ToDoListForm'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const getPersonalTodos = () => {
  return sleep(1000).then(() => Promise.resolve({
    '0000000001': {
      id: '0000000001',
      title: 'First List',
      todos: ['First todo of first list!'],
      checkBox: ['']                  //adding checkBox do dictionary.
    },
    '0000000002': {
      id: '0000000002',
      title: 'Second List',
      todos: ['First todo of second list!'],
      checkBox: ['']
    }
  }))
}



export const ToDoLists = ({ style }) => {
  const [toDoLists, setToDoLists] = useState({})
  const [activeList, setActiveList] = useState()


  useEffect(() => {                        //making sure that whatever is saved  in the todolist and persisted on the server is loaded when refreshing the state.
    if (localStorage.getItem("currentLists") == null) {     //checking if something has been saved
    getPersonalTodos()
      .then(setToDoLists)
    } else {
      const currentLists = localStorage.getItem('currentLists');  //getting data from server
      setToDoLists(JSON.parse(currentLists));
    }}, [])


  useEffect(() => {
      localStorage.setItem('currentLists', JSON.stringify(toDoLists));  //saving data to server.
  }, [toDoLists]);

  if (!Object.keys(toDoLists).length) return null
  return <Fragment>
    <Card style={style}>
      <CardContent>
        <Typography
          variant='headline'
          component='h2'
        >
          My ToDo Lists
        </Typography>
        <List>
          {Object.keys(toDoLists).map((key) => <ListItem
            key={key}
            button
            onClick={() => setActiveList(key)}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary={toDoLists[key].title} />
          </ListItem>)}
        </List>
      </CardContent>
    </Card>
    {toDoLists[activeList] && <ToDoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      toDoList={toDoLists[activeList]}
       saveToDoList={(id, { todos }, { checkBox }) => { //saving checkbox state.
        const listToUpdate = toDoLists[id]
        setToDoLists(
          {
          ...toDoLists,
          [id]: { ...listToUpdate, todos, checkBox }    //adding checkbox data to todolists.
        } )
      }}
    />}
  </Fragment>
}
