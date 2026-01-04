/**
 * Product Members List Component
 */
'use client'

import { Trash2, UserCog, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAvatarProps } from '@/utils/avatar-utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useProductMembers, useRemoveProductMember } from '../hooks/use-product-members'

interface ProductMembersListProps {
  productId: string
  onInviteClick?: () => void
}

export function ProductMembersList({ productId, onInviteClick }: ProductMembersListProps) {
  const { data: members, isLoading, error } = useProductMembers(productId)
  const removeMutation = useRemoveProductMember()

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    try {
      await removeMutation.mutateAsync({ productId, userId })
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-12 bg-gray-200 rounded animate-pulse' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='rounded-md bg-red-50 p-4 text-sm text-red-700'>
            Failed to load team members
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <Users className='h-5 w-5' />
          Team Members ({members?.length || 0})
        </CardTitle>
        <Button size='sm' onClick={onInviteClick}>
          + Invite
        </Button>
      </CardHeader>
      <CardContent>
        {!members || members.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <UserCog className='h-12 w-12 mx-auto mb-2 opacity-50' />
            <p>No team members yet</p>
            <Button variant='outline' size='sm' className='mt-4' onClick={onInviteClick}>
              Invite someone
            </Button>
          </div>
        ) : (
          <div className='space-y-3'>
            {members.map((member) => {
              const avatarProps = getAvatarProps(member.user_name || 'User')
              return (
                <div
                  key={member.id}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition'
                >
                  <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className={avatarProps.colorClass}>
                        {avatarProps.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{member.user_name}</p>
                      <p className='text-xs text-gray-500 truncate'>{member.user_email}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    {member.role_name && (
                      <Badge variant='secondary' className='ml-2'>
                        {member.role_name}
                      </Badge>
                    )}
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleRemoveMember(member.user_id as string)}
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className='h-4 w-4 text-red-500 hover:text-red-700' />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
