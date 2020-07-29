import React from 'react'
import { 
  render, 
  screen, 
  fireEvent,
  waitFor 
} from '@testing-library/react'
import axios from 'axios'

import App from '../FortyYearAnnual.js'

jest.mock('axios')

const response = {
   data: {
     data: [
       {period: "Fake", data: [0.1, 0.1, 0.1]},
       {period: "Fake", data: [0.1, 0.1, 0.1]},
       {period: "Fake", data: [0.1, 0.1, 0.1]} 
     ]
   }
}

describe('Testing the functionality of the main app', () => {

  it('can reset the portfolio went the simulation is finished', async () => {
    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))

    const input = app.getByLabelText('weight-input-0')
    fireEvent.change(
      input, { target: { value: '100' } })
    await waitFor(() => app.getByText(/Next Step/))
   
    const leftClick = { button: 1 }
    fireEvent.click(
      app.getByText('Next Step'), leftClick)
    fireEvent.click(
      app.getByText('Next Step'), leftClick)
    fireEvent.click(
      app.getByText('Next Step'), leftClick)

    expect(app.getByText('Reset')).toBeTruthy()
    fireEvent.click(
      app.getByText('Reset'), leftClick)

    //This is not great but we seem to need this because the app
    //is doing another fake api call and reloading the component tree
    await waitFor(() => setTimeout(() => true, 100))
    
    expect(app.getByText(/Period: 0/)).toBeTruthy()
    expect(app.getByText(/100/)).toBeTruthy()

    const inputUpdated = app.getByLabelText('weight-input-0')
    expect(inputUpdated.value).toBe('')
    
  })

  it('will show the client the periods when the sim is complete', async () => {

    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))

    const input = app.getByLabelText('weight-input-0')
    fireEvent.change(
      input, { target: { value: '100' } })
    await waitFor(() => app.getByText(/Next Step/))
   
    const leftClick = { button: 1 }
    fireEvent.click(
      app.getByText('Next Step'), leftClick)
    fireEvent.click(
      app.getByText('Next Step'), leftClick)
    fireEvent.click(
      app.getByText('Next Step'), leftClick)

    expect(app.getAllByText(/Fake/)).toBeTruthy()
    expect(app.getAllByText(/Fake/)).toHaveLength(3)
  })

  it('will tell client when sim is complete and remove button', async () => {

    const response = {
       data: {
         data: [
           {period: "Fake", data: [0.1, 0.1]},
           {period: "Fake", data: [0.1, 0.1]}
         ]
       }
    }

    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))

    const input = app.getByLabelText('weight-input-0')
    fireEvent.change(
      input, { target: { value: '100' } })
    await waitFor(() => app.getByText(/Next Step/))
   
    const leftClick = { button: 1 }
    fireEvent.click(
      app.getByText('Next Step'), leftClick)
    fireEvent.click(
      app.getByText('Next Step'), leftClick)

    expect(app.queryByText(/Next Step/)).toBeNull()
    expect(app.queryByText(/Sim Complete/)).toBeTruthy()
  })

  it('won\'t render the next step button at start', async () => {
    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))

    expect(app.queryByText(/Next Step/)).toBeNull()
  })

  it('returns errors to clients when the weight input is invalid', async () => {
    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))
 
    const input = app.getByLabelText('weight-input-0')
    const inputTwo = app.getByLabelText('weight-input-1')

    fireEvent.change(
      input, { target: { value: 'cats' } })
    expect(app.queryByText(/Next Step/)).toBeNull()
    await waitFor(() => app.getByText(/Weights invalid/))
    expect(app.queryByText(/Weights invalid/)).toBeTruthy()

    fireEvent.change(
      input, { target: { value: '-1' } })
    expect(app.queryByText(/Next Step/)).toBeNull()
    await waitFor(() => app.getByText(/Weights invalid/))
    expect(app.queryByText(/Weights invalid/)).toBeTruthy()

    fireEvent.change(
      input, { target: { value: '101' } })
    expect(app.queryByText(/Next Step/)).toBeNull()
    await waitFor(() => app.getByText(/Weights invalid/))
    expect(app.queryByText(/Weights invalid/)).toBeTruthy()

    fireEvent.change(
      input, { target: { value: '1000' } })
    expect(app.queryByText(/Next Step/)).toBeNull()
    await waitFor(() => app.getByText(/Weights invalid/))
    expect(app.queryByText(/Weights invalid/)).toBeTruthy()

    fireEvent.change(
      input, { target: { value: '40' } })
    expect(app.queryByText(/Next Step/)).toBeTruthy()
    expect(app.queryByText(/Weights invalid/)).toBeNull()

    fireEvent.change(
      input, { target: { value: '40' } })
    fireEvent.change(
      inputTwo, { target: { value: '80' } })
    expect(app.queryByText(/Next Step/)).toBeNull()
    expect(app.queryByText(/Weights invalid/)).toBeTruthy()
  })

  it('will remove a weight without throwing an error', async () => {
    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))
 
    const input = app.getByLabelText('weight-input-0')
    const inputTwo = app.getByLabelText('weight-input-1')

    fireEvent.change(
      input, { target: { value: '50' } })
    fireEvent.change(
      inputTwo, { target: { value: '50' } })
    fireEvent.change(
      input, { target: { value: '0' } })
    await waitFor(() => inputTwo.value == '0')

    expect(app.queryByText(/Next Step/)).toBeTruthy()
    expect(app.queryByText(/Weights invalid/)).toBeNull()
  })

  it('renders without throwing errors', () => {
    axios.get.mockReturnValue(Promise.resolve(response))
    render(<App />)
    expect(screen.getByTestId('app')).toBeTruthy()
    expect(axios.get).toHaveBeenCalledWith(
      'http://test:8000/api/sample')
  })

  it('will update the weights correctly with input', async () => {
    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))
 
    const input = app.getByLabelText('weight-input-0')
    fireEvent.change(
      input, { target: { value: '20' } })
    expect(input.value).toBe('20')
  })

  it('will update the shown portfolio with button click', async () => {
    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))

    const input = app.getByLabelText('weight-input-0')
    fireEvent.change(
      input, { target: { value: '100' } })
    await waitFor(() => app.getByText(/Next Step/))
   
    const leftClick = { button: 1 }
    fireEvent.click(
      app.getByText('Next Step'), leftClick)

    expect(app.getByText(/110.00/)).toBeTruthy()
  })

  it('will update the period counter with button click', async () => {
    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))

    const input = app.getByLabelText('weight-input-0')
    fireEvent.change(
      input, { target: { value: '100' } })
    await waitFor(() => app.getByText(/Next Step/))
   
    const leftClick = { button: 1 }
    fireEvent.click(
      app.getByText('Next Step'), leftClick)

    expect(app.getByText(/Period: 1/)).toBeTruthy()
  })

  it('has correct # of inputs for the number of assets', async () => {

    const response = {
       data: {
         data: [
           {period: "Fake", data: [0.1, 0.1, 0.1]},
           {period: "Fake", data: [0.1, 0.1, 0.1]}
         ]
       }
    }

    axios.get.mockReturnValue(Promise.resolve(response))
    const app = render(<App />)
    await waitFor(() => app.getByLabelText('weight-input-0'))

    expect(app.queryAllByLabelText(/weight-input.*/)).toHaveLength(2)
  })

})
