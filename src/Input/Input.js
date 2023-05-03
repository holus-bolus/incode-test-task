import React from 'react';
import axios from 'axios';
import https from 'https-browserify';
import {DragDropContext} from "react-beautiful-dnd";
import IssueList from "./IssueList";

const url = require('url');

const instance = axios.create({
  httpsAgent: new https.Agent({rejectUnauthorized: false})
});

const columns = {
  todo: {
    id: 'todo',
    title: 'To do',
    issues: []
  },
  inProgress: {
    id: 'inProgress',
    title: 'In progress',
    issues: []
  },
  done: {
    id: 'done',
    title: 'Done',
    issues: []
  }
};

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      repoName: '',
      issues: [],
      error: null,
      positions: {} // new state property to store issue positions
    };

  }

  handleInputChange = (event) => {
    this.setState({
      inputValue: event.target.value
    });
  }

  componentDidMount() {
    const positions = JSON.parse(localStorage.getItem('positions')) || {};
    this.setState({ positions });
  }


  handleButtonClick = () => {
    instance.get(`https://api.github.com/repos/${this.state.inputValue}`)
      .then(response => {
        const {name} = response.data;
        this.setState({repoName: name});
        return instance.get(`https://api.github.com/repos/${this.state.inputValue}/issues`);
      })
      .then(response => {
        const issues = response.data.map(issue => ({
          id: issue.number,
          title: issue.title,
          openedAt: issue.created_at,
          openedBy: issue.user.login,
          commentsCount: issue.comments
        }));
        this.setState({columns: {...this.state.columns, todo: {...this.state.columns.todo, issues}}, error: null});
      })
      .catch(error => {
        this.setState({error: 'An error occurred while loading the data.'});
      });
  }

  handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const issue = this.state.issues.find(issue => issue.id === Number(draggableId));
    const newPositions = {
      ...this.state.positions,
      [draggableId]: { column: destination.droppableId, index: destination.index }
    };
    localStorage.setItem('positions', JSON.stringify(newPositions));
    this.setState((prevState) => {
      const updatedIssues = [...prevState.issues];
      updatedIssues.splice(source.index, 1);
      updatedIssues.splice(destination.index, 0, issue);
      return { issues: updatedIssues, positions: newPositions };
    });
  };


  render() {
    return (
      <div>
        <label htmlFor="input-field">Enter your GitHub repository:</label>
        <input
          id="input-field"
          type="text"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleButtonClick}>Load</button>
        {this.state.repoName && <h2>{this.state.repoName}</h2>}
        {this.state.error && <p>{this.state.error}</p>}
        {this.state.issues.length > 0 && (
          <div>
            <div>
              <a href={this.state.repoUrl} target="_blank" rel="noopener noreferrer">
                Visit Repo
              </a>
              <a href={this.state.ownerUrl} target="_blank" rel="noopener noreferrer">
                Visit Owner
              </a>
            </div>
            <h2>Todo</h2>
            <IssueList
              issues={this.state.issues.filter(issue => issue.status === 'todo')}
              onDragStart={this.handleDragStart}
              onDragOver={this.handleDragOver}
              onDrop={this.handleDrop}
            />
            <h2>In Progress</h2>
            <IssueList
              issues={this.state.issues.filter(issue => issue.status === 'inProgress')}
              onDragStart={this.handleDragStart}
              onDragOver={this.handleDragOver}
              onDrop={this.handleDrop}
            />
            <h2>Done</h2>
            <IssueList
              issues={this.state.issues.filter(issue => issue.status === 'done')}
              onDragStart={this.handleDragStart}
              onDragOver={this.handleDragOver}
              onDrop={this.handleDrop}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Input;
