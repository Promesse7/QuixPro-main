import React from 'react'
import { Meta, Story } from '@storybook/react'
import ChatWindow from './ChatWindow'
import { chatMessages } from '@/components/storybook/storyData'

export default {
  title: 'Chat/ChatWindow',
  component: ChatWindow,
} as Meta

const messages = [
  { _id: 'm1', senderId: 'u1', sender: { name: 'Alice', image: '' }, content: 'Hi team, ready to solve?', createdAt: new Date().toISOString(), type: 'text' },
  { _id: 'm2', senderId: 'u2', sender: { name: 'Bob', image: '' }, content: 'Yes! Let\'s start with question 3.', createdAt: new Date().toISOString(), type: 'text' },
]

const Template: Story = (args) => <div className="p-4 max-w-3xl h-[70vh]"><ChatWindow {...args} /></div>

export const Default = Template.bind({})
Default.args = {
  groupId: 'g1',
}
