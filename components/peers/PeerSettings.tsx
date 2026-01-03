'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Users, 
  Bell,
  Shield,
  Globe,
  Lock,
  UserPlus
} from 'lucide-react'

interface PeerSettings {
  userId: string
  profileVisibility: 'public' | 'peers_only' | 'private'
  allowRecommendations: boolean
  showActivityStatus: boolean
  allowFriendRequests: boolean
  emailNotifications: {
    friendRequests: boolean
    recommendations: boolean
    activities: boolean
    messages: boolean
  }
  pushNotifications: {
    friendRequests: boolean
    recommendations: boolean
    activities: boolean
    messages: boolean
  }
  privacy: {
    showOnlineStatus: boolean
    showLastSeen: boolean
    allowProfileSearch: boolean
    shareAcademicInfo: boolean
  }
  discovery: {
    maxRecommendations: number
    recommendationTypes: string[]
    autoAcceptSimilarLevel: boolean
    showMutualConnections: boolean
  }
}

const defaultSettings: PeerSettings = {
  userId: '',
  profileVisibility: 'peers_only',
  allowRecommendations: true,
  showActivityStatus: true,
  allowFriendRequests: true,
  emailNotifications: {
    friendRequests: true,
    recommendations: false,
    activities: true,
    messages: true
  },
  pushNotifications: {
    friendRequests: true,
    recommendations: true,
    activities: false,
    messages: true
  },
  privacy: {
    showOnlineStatus: true,
    showLastSeen: false,
    allowProfileSearch: true,
    shareAcademicInfo: true
  },
  discovery: {
    maxRecommendations: 10,
    recommendationTypes: ['similar_level', 'school_mate', 'high_activity'],
    autoAcceptSimilarLevel: false,
    showMutualConnections: true
  }
}

export default function PeerSettingsComponent() {
  const [settings, setSettings] = useState<PeerSettings>(defaultSettings)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/peers?type=settings')
      if (response.ok) {
        const data = await response.json()
        if (data.settings) {
          setSettings(data.settings)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<PeerSettings>) => {
    setSaving(true)
    try {
      const response = await fetch('/api/peers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings: newSettings
        })
      })

      if (response.ok) {
        setSettings(prev => ({ ...prev, ...newSettings }))
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSettingChange = (category: keyof PeerSettings, field: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: typeof settings[category] === 'object' 
        ? { ...settings[category], [field]: value }
        : value
    }
    setSettings(newSettings)
  }

  const saveAllSettings = async () => {
    await updateSettings(settings)
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4" />
      case 'peers_only': return <Users className="h-4 w-4" />
      case 'private': return <Lock className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const getVisibilityDescription = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'Anyone can see your profile and activities'
      case 'peers_only': return 'Only connected peers can see your profile and activities'
      case 'private': return 'Only you can see your profile and activities'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Peer Settings
          </h1>
          <p className="text-muted-foreground">Manage your peer discovery and privacy preferences</p>
        </div>
        <Button onClick={saveAllSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visibility">Who can see your profile?</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value: 'public' | 'peers_only' | 'private') => 
                handleSettingChange('profileVisibility' as keyof PeerSettings, '', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="peers_only">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Peers Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {getVisibilityDescription(settings.profileVisibility)}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show activity status</Label>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're active
                </p>
              </div>
              <Switch
                checked={settings.showActivityStatus}
                onCheckedChange={(checked) => 
                  handleSettingChange('showActivityStatus' as keyof PeerSettings, '', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow friend requests</Label>
                <p className="text-sm text-muted-foreground">
                  Let others send you connection requests
                </p>
              </div>
              <Switch
                checked={settings.allowFriendRequests}
                onCheckedChange={(checked) => 
                  handleSettingChange('allowFriendRequests' as keyof PeerSettings, '', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow recommendations</Label>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered peer suggestions
                </p>
              </div>
              <Switch
                checked={settings.allowRecommendations}
                onCheckedChange={(checked) => 
                  handleSettingChange('allowRecommendations' as keyof PeerSettings, '', checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show online status</Label>
              <p className="text-sm text-muted-foreground">
                Let others see when you're online
              </p>
            </div>
            <Switch
              checked={settings.privacy.showOnlineStatus}
              onCheckedChange={(checked) => 
                handleSettingChange('privacy', 'showOnlineStatus', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show last seen</Label>
              <p className="text-sm text-muted-foreground">
                Show when you were last active
              </p>
            </div>
            <Switch
              checked={settings.privacy.showLastSeen}
              onCheckedChange={(checked) => 
                handleSettingChange('privacy', 'showLastSeen', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow profile search</Label>
              <p className="text-sm text-muted-foreground">
                Let others find you in search
              </p>
            </div>
            <Switch
              checked={settings.privacy.allowProfileSearch}
              onCheckedChange={(checked) => 
                handleSettingChange('privacy', 'allowProfileSearch', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Share academic information</Label>
              <p className="text-sm text-muted-foreground">
                Share your level and school for better recommendations
              </p>
            </div>
            <Switch
              checked={settings.privacy.shareAcademicInfo}
              onCheckedChange={(checked) => 
                handleSettingChange('privacy', 'shareAcademicInfo', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Discovery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Discovery Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Maximum recommendations per day</Label>
            <div className="px-4">
              <Slider
                value={[settings.discovery.maxRecommendations]}
                onValueChange={([value]) => 
                  handleSettingChange('discovery', 'maxRecommendations', value)
                }
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>{settings.discovery.maxRecommendations}</span>
                <span>20</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recommendation types</Label>
            <div className="grid grid-cols-2 gap-2">
              {['similar_level', 'school_mate', 'high_activity', 'shared_course'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Switch
                    id={type}
                    checked={settings.discovery.recommendationTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...settings.discovery.recommendationTypes, type]
                        : settings.discovery.recommendationTypes.filter(t => t !== type)
                      handleSettingChange('discovery', 'recommendationTypes', newTypes)
                    }}
                  />
                  <Label htmlFor={type} className="text-sm capitalize">
                    {type.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-accept similar level requests</Label>
              <p className="text-sm text-muted-foreground">
                Automatically accept requests from users at your level
              </p>
            </div>
            <Switch
              checked={settings.discovery.autoAcceptSimilarLevel}
              onCheckedChange={(checked) => 
                handleSettingChange('discovery', 'autoAcceptSimilarLevel', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show mutual connections</Label>
              <p className="text-sm text-muted-foreground">
                Highlight mutual connections in recommendations
              </p>
            </div>
            <Switch
              checked={settings.discovery.showMutualConnections}
              onCheckedChange={(checked) => 
                handleSettingChange('discovery', 'showMutualConnections', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">Email Notifications</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Friend requests</Label>
                <Switch
                  checked={settings.emailNotifications.friendRequests}
                  onCheckedChange={(checked) => 
                    handleSettingChange('emailNotifications', 'friendRequests', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>New recommendations</Label>
                <Switch
                  checked={settings.emailNotifications.recommendations}
                  onCheckedChange={(checked) => 
                    handleSettingChange('emailNotifications', 'recommendations', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Peer activities</Label>
                <Switch
                  checked={settings.emailNotifications.activities}
                  onCheckedChange={(checked) => 
                    handleSettingChange('emailNotifications', 'activities', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Messages</Label>
                <Switch
                  checked={settings.emailNotifications.messages}
                  onCheckedChange={(checked) => 
                    handleSettingChange('emailNotifications', 'messages', checked)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4">Push Notifications</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Friend requests</Label>
                <Switch
                  checked={settings.pushNotifications.friendRequests}
                  onCheckedChange={(checked) => 
                    handleSettingChange('pushNotifications', 'friendRequests', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>New recommendations</Label>
                <Switch
                  checked={settings.pushNotifications.recommendations}
                  onCheckedChange={(checked) => 
                    handleSettingChange('pushNotifications', 'recommendations', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Peer activities</Label>
                <Switch
                  checked={settings.pushNotifications.activities}
                  onCheckedChange={(checked) => 
                    handleSettingChange('pushNotifications', 'activities', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Messages</Label>
                <Switch
                  checked={settings.pushNotifications.messages}
                  onCheckedChange={(checked) => 
                    handleSettingChange('pushNotifications', 'messages', checked)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
