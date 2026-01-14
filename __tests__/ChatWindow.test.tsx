import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatWindow from '@/components/chat/ChatWindow'

describe('ChatWindow accessibility', () => {
  it('has live regions for typing and delivery status', () => {
    render(<ChatWindow groupId="test" />)
    const typing = screen.getByRole('status', { hidden: true }) || screen.getByText('', { selector: '#chat-status', exact: false })
    // ensure live region exists (either by id or sr-only)
    const delivery = document.querySelector('#chat-delivery-status')
    expect(delivery).toBeInTheDocument()
  })
})
