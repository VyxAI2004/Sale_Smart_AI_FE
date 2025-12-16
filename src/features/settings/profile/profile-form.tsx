import { z } from 'zod'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getMyProfile, updateMyProfile } from '@/apis/user.api'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters.')
    .max(50, 'Username must not be longer than 50 characters.'),
  email: z.string().email('Please enter a valid email.'),
  bio: z.string().max(500).min(0).optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url('Please enter a valid URL.').or(z.literal('')),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const queryClient = useQueryClient()
  
  // Load user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => getMyProfile(),
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      email: '',
      bio: '',
      urls: [],
    },
    mode: 'onChange',
  })

  // Update form when user data loads - using useEffect to avoid infinite loop
  useEffect(() => {
    if (userData?.data && !isLoading) {
      const user = userData.data
      form.reset({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        urls: user.urls && user.urls.length > 0 
          ? user.urls.map(url => ({ value: url }))
          : [],
      })
    }
  }, [userData?.data, isLoading, form])

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => updateMyProfile({
      username: data.username,
      email: data.email,
      bio: data.bio || undefined,
      urls: data.urls?.filter(url => url.value).map(url => url.value) || undefined,
    }),
    onSuccess: () => {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Failed to update profile')
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='your@email.com' {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>
                Your email address. You can manage verified email addresses in your{' '}
                <Link to='/'>email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us a little bit about yourself'
                  className='resize-none'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => append({ value: '' })}
            disabled={isLoading}
          >
            Add URL
          </Button>
        </div>
        <Button type='submit' disabled={isLoading || updateMutation.isPending}>
          {updateMutation.isPending ? 'Updating...' : 'Update profile'}
        </Button>
      </form>
    </Form>
  )
}
