import React from 'react';
import { render } from '@testing-library/react';
import IssueList from './IssueList';

describe('IssueList component', () => {
  const issues = [
    {
      id: 1,
      title: 'Test Issue 1',
      openedAt: '2022-05-01T00:00:00Z',
      openedBy: 'testuser1',
      commentsCount: 2,
      column: 'todo',
      order: 1
    },
    {
      id: 2,
      title: 'Test Issue 2',
      openedAt: '2022-05-02T00:00:00Z',
      openedBy: 'testuser2',
      commentsCount: 1,
      column: 'inProgress',
      order: 1
    },
    {
      id: 3,
      title: 'Test Issue 3',
      openedAt: '2022-05-03T00:00:00Z',
      openedBy: 'testuser3',
      commentsCount: 0,
      column: 'done',
      order: 1
    }
  ];

  it('should render a list of issues', () => {
    const { getByRole } = render(<IssueList issues={issues} />);
    const list = getByRole('list');
    expect(list.children.length).toBe(3);
  });

  it('should render the correct issue information', () => {
    const { getByText } = render(<IssueList issues={issues} />);
    const issue1 = getByText('Test Issue 1');
    expect(issue1).toBeInTheDocument();
    const issue2 = getByText('Test Issue 2');
    expect(issue2).toBeInTheDocument();
    const issue3 = getByText('Test Issue 3');
    expect(issue3).toBeInTheDocument();
  });

  it('should render issues in the correct columns', () => {
    const { getByText } = render(<IssueList issues={issues} />);
    const todoColumn = getByText('Todo');
    expect(todoColumn.nextElementSibling.children.length).toBe(1);
    const inProgressColumn = getByText('In Progress');
    expect(inProgressColumn.nextElementSibling.children.length).toBe(1);
    const doneColumn = getByText('Done');
    expect(doneColumn.nextElementSibling.children.length).toBe(1);
  });
});
