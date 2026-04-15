import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import CategorySelection from './CategorySelection'

describe('CategorySelection', () => {
  it('renders without crashing', () => {
    render(<CategorySelection onStartQuiz={vi.fn()} />)
    expect(screen.getByText('Choose Your Quiz')).toBeInTheDocument()
  })

  it('renders difficulty buttons', () => {
    render(<CategorySelection onStartQuiz={vi.fn()} />)
    expect(screen.getAllByText('Easy').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Medium').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Hard').length).toBeGreaterThan(0)
  })

  it('calls onStartQuiz when a difficulty button is clicked', async () => {
    const mockOnStartQuiz = vi.fn()
    render(<CategorySelection onStartQuiz={mockOnStartQuiz} />)
    await userEvent.click(screen.getAllByText('Easy')[0])
    expect(mockOnStartQuiz).toHaveBeenCalledTimes(1)
  })
})
