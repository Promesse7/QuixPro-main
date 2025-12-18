import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CreatePost from '@/components/quix-sites/CreatePost'

describe('CreatePost', () => {
  it('renders title and body fields and disables submit when title empty', () => {
    render(<CreatePost />)
    expect(screen.getByLabelText(/Post title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Post body/i)).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /create post/i })
    expect(btn).toBeDisabled()
  })
})
