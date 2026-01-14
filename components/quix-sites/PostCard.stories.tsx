import React from 'react'
import { Meta, Story } from '@storybook/react'
import PostCard from './PostCard'
import { postSamples } from '@/components/storybook/storyData'

export default {
  title: 'QuixSites/PostCard',
  component: PostCard,
} as Meta

const Template: Story = (args) => <div className="p-4 max-w-lg"><PostCard {...args} /></div>

export const Default = Template.bind({})
Default.args = {
  post: postSamples[0],
}
