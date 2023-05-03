import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const IssueList = ({ issues, setIssues }) => {
  const [columnOrder, setColumnOrder] = useState([]);

  useEffect(() => {
    const storedColumnOrder = localStorage.getItem('columnOrder');
    if (storedColumnOrder) {
      setColumnOrder(JSON.parse(storedColumnOrder));
    } else {
      setColumnOrder(['todo', 'inProgress', 'done']);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('columnOrder', JSON.stringify(columnOrder));
  }, [columnOrder]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    const newIssues = [...issues];
    const sourceColumn = columnOrder.indexOf(source.droppableId);
    const destinationColumn = columnOrder.indexOf(destination.droppableId);
    const [removed] = newIssues[sourceColumn].splice(source.index, 1);
    newIssues[destinationColumn].splice(destination.index, 0, removed);
    setIssues(newIssues);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="issue-list">
        {columnOrder.map(columnId => {
          const issuesInColumn = issues[columnOrder.indexOf(columnId)];
          return (
            <div key={columnId} className="issue-column">
              <h2>{columnId.toUpperCase()}</h2>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <ul
                    className="issue-list"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {issuesInColumn.map((issue, index) => (
                      <Draggable key={issue.id} draggableId={issue.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="issue-item"
                          >
                            <strong>{issue.id}: </strong>{issue.title}<br />
                            <span><strong>Opened at:</strong> {issue.openedAt}, <strong>Opened by:</strong> {issue.openedBy}, <strong>Comments:</strong> {issue.commentsCount}</span>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  );
};

export default IssueList;
