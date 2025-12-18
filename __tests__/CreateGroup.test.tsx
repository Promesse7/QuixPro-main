import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CreateGroup from '@/components/groups/CreateGroup'

describe('CreateGroup', () => {
  it('renders form fields and disabled submit when name empty', () => {
    render(<CreateGroup />)
    expect(screen.getByLabelText(/Group name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Group description/i)).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /create/i })
    expect(btn).toBeDisabled()
  })
})
