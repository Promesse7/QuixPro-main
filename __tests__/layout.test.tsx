import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RootLayout from '@/app/layout'

describe('RootLayout accessibility', () => {
  it('renders skip link with correct href', () => {
    render(<RootLayout>{<div>Content</div>}</RootLayout>)
    const skip = screen.getByRole('link', { name: /skip to main content/i })
    expect(skip).toBeInTheDocument()
    expect(skip).toHaveAttribute('href', '#main-content')
  })
})
