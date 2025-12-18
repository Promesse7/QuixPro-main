import React from 'react'
import { Meta, Story } from '@storybook/react'
import GroupCard from './GroupCard'
import { groupSamples } from '@/components/storybook/storyData'

export default {
  title: 'Groups/GroupCard',
  component: GroupCard,
} as Meta

const Template: Story = (args) => <div className="p-4 max-w-sm"><GroupCard {...args} /></div>

export const Default = Template.bind({})
Default.args = {
  group: groupSamples[0],
}
