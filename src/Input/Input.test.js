import React from 'react';
import axios from 'axios';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import Input from './Input';

jest.mock('axios');

describe('Input component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Input />);
  });

  it('should display repo name and issues when valid repo is entered and Load button is clicked', async () => {
    const mockResponse = {
      data: {
        name: 'test-repo',
      },
    };
    axios.get.mockResolvedValueOnce(mockResponse);
    axios.get.mockResolvedValueOnce({ data: [] });

    const { getByLabelText, getByRole, getByText } = render(<Input />);
    const input = getByLabelText('Enter your GitHub repository:');
    const loadButton = getByRole('button', { name: 'Load' });

    fireEvent.change(input, { target: { value: 'test-user/test-repo' } });
    fireEvent.click(loadButton);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    expect(getByText('test-repo')).toBeInTheDocument();
    expect(getByText('Todo')).toBeInTheDocument();
  });

  it('should display error message when invalid repo is entered and Load button is clicked', async () => {
    const mockError = new Error('Failed to fetch');
    axios.get.mockRejectedValueOnce(mockError);

    const { getByLabelText, getByRole, getByText } = render(<Input />);
    const input = getByLabelText('Enter your GitHub repository:');
    const loadButton = getByRole('button', { name: 'Load' });

    fireEvent.change(input, { target: { value: 'invalid/repo' } });
    fireEvent.click(loadButton);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(getByText('An error occurred while loading the data.')).toBeInTheDocument();
  });
});
